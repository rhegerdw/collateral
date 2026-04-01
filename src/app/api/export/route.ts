import { EnhancedOnePager } from '@/lib/collateral/types';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHtml(data: EnhancedOnePager): string {
  const sectionsHtml = data.sections
    .map(
      (s) => {
        const paragraphs = s.body
          .split('\n\n')
          .map((p) => `      <p>${escapeHtml(p)}</p>`)
          .join('\n');
        return `
    <section>
      <h2>${escapeHtml(s.heading)}</h2>
      <div class="body">
${paragraphs}
      </div>
    </section>`;
      }
    )
    .join('\n');

  const statsHtml = data.stats
    .map(
      (s) => `
        <div class="stat-box">
          <div class="stat-number">${escapeHtml(String(s.number))}</div>
          <div class="stat-label">${escapeHtml(s.label)}</div>
        </div>`
    )
    .join('\n');

  const statsColClass =
    data.stats.length <= 4 ? `cols-${data.stats.length}` : 'cols-4';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DarkWebIQ - ${escapeHtml(data.headline)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #111;
      max-width: 800px;
      margin: 0 auto;
      padding: 48px 40px;
      line-height: 1.6;
    }
    header {
      border-bottom: 4px solid #000;
      padding-bottom: 24px;
      margin-bottom: 36px;
    }
    .brand {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #6b7280;
      margin-bottom: 8px;
    }
    h1 {
      font-size: 36px;
      font-weight: 900;
      line-height: 1.15;
      margin-bottom: 10px;
    }
    .subheadline {
      font-size: 18px;
      color: #4b5563;
      line-height: 1.4;
      margin-bottom: 8px;
    }
    .prepared {
      font-size: 14px;
      color: #6b7280;
    }
    .prepared strong { color: #111; }
    section {
      margin-bottom: 32px;
    }
    h2 {
      font-size: 18px;
      font-weight: 700;
      color: #ff4400;
      margin-bottom: 12px;
    }
    .body p {
      color: #374151;
      margin-bottom: 14px;
    }
    .body p:last-child { margin-bottom: 0; }
    .stats-section { margin-bottom: 32px; }
    .stats-grid {
      display: grid;
      gap: 12px;
      text-align: center;
    }
    .stats-grid.cols-1 { grid-template-columns: 1fr; }
    .stats-grid.cols-2 { grid-template-columns: 1fr 1fr; }
    .stats-grid.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
    .stats-grid.cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
    .stat-box {
      background: #f3f4f6;
      padding: 16px 12px;
    }
    .stat-number {
      font-size: 24px;
      font-weight: 900;
    }
    .stat-label {
      font-size: 13px;
      color: #6b7280;
      margin-top: 2px;
    }
    .cta {
      border-top: 2px solid #000;
      padding-top: 24px;
    }
    .cta p { font-size: 14px; }
    .cta strong { font-weight: 700; }
    .cta span { color: #374151; }
    @media print {
      body { padding: 0; }
      @page { margin: 0.75in; size: letter; }
      section { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">DARKWEBIQ</div>
    <h1>${escapeHtml(data.headline)}</h1>
    <p class="subheadline">${escapeHtml(data.subheadline)}</p>
    <p class="prepared">Prepared for <strong>${escapeHtml(data.company)}</strong></p>
  </header>
${sectionsHtml}
  <div class="stats-section">
    <h2>By the Numbers</h2>
    <div class="stats-grid ${statsColClass}">
${statsHtml}
    </div>
  </div>
  <div class="cta">
    <p><strong>Next Step:</strong> <span>${escapeHtml(data.cta)}</span></p>
  </div>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as EnhancedOnePager;
    const html = renderHtml(data);

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="DarkWebIQ-${data.headline.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 50)}.html"`,
      },
    });
  } catch (err) {
    console.error('Export error:', err);
    return Response.json({ error: 'Export failed' }, { status: 500 });
  }
}
