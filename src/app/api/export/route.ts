import { EnhancedOnePager, ReportChart } from '@/lib/collateral/types';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function boldMarkdown(text: string): string {
  return escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function renderChart(chart: ReportChart): string {
  let inner = '';

  switch (chart.type) {
    case 'bar-chart':
      inner = chart.bars.map((bar) => `
        <div class="bar-row">
          <div class="bar-label">${escapeHtml(bar.label)}</div>
          <div class="bar-track"><div class="bar-fill ${bar.style}" style="width:${bar.value}%">${escapeHtml(bar.displayValue)}</div></div>
        </div>`).join('\n');
      break;

    case 'timeline':
      inner = `<div class="timeline">${chart.items.map((item) => `
        <div class="timeline-item${item.muted ? ' muted' : ''}">
          <div class="timeline-date">${escapeHtml(item.date)}</div>
          <div class="timeline-text">${escapeHtml(item.text)}</div>
        </div>`).join('\n')}
      </div>`;
      break;

    case 'comparison':
      inner = `<div class="comparison-grid">${chart.boxes.map((box) => `
        <div class="comparison-box">
          <h4>${escapeHtml(box.title)}</h4>
          ${box.items.map((item) => `
          <div class="comparison-number${item.highlight ? ' highlight' : ''}" style="${item.highlight ? '' : 'margin-top:8px'}">${escapeHtml(item.number)}</div>
          <div class="comparison-detail">${escapeHtml(item.detail)}</div>`).join('\n')}
          ${box.footnote ? `<div style="font-size:13px;color:#374151;margin-top:10px;line-height:1.5">${escapeHtml(box.footnote)}</div>` : ''}
        </div>`).join('\n')}
      </div>`;
      break;

    case 'pipeline':
      inner = `<div class="pipeline-flow">${chart.stages.map((stage, i) => `
        <div class="pipeline-stage s${i + 1}"><span class="stage-label">STAGE ${i + 1}</span>${escapeHtml(stage.label)}</div>`).join('\n')}
      </div>`;
      if (chart.footnotes?.length) {
        inner += `<div style="display:grid;grid-template-columns:repeat(${chart.footnotes.length},1fr);gap:12px;margin-top:16px">${chart.footnotes.map((fn) => `
          <div style="text-align:center;padding:12px;background:#f9fafb;border:1px solid #e5e7eb">
            <div style="font-size:13px;font-weight:700;color:#111">${escapeHtml(fn.number)}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:2px">${escapeHtml(fn.detail)}</div>
          </div>`).join('\n')}
        </div>`;
      }
      break;
  }

  return `
  <div class="chart-section">
    <div class="chart-container">
      <div class="chart-title">${escapeHtml(chart.title)}</div>
      ${inner}
    </div>
  </div>`;
}

function renderHtml(data: EnhancedOnePager): string {
  // Build chart map: afterSection index -> array of chart HTML
  const chartMap: Record<number, string[]> = {};
  if (data.charts?.length) {
    for (const chart of data.charts) {
      const idx = chart.afterSection;
      if (!chartMap[idx]) chartMap[idx] = [];
      chartMap[idx].push(renderChart(chart));
    }
  }

  // Build sections with interleaved charts
  const sectionsHtml = data.sections
    .map((s, i) => {
      const paragraphs = s.body
        .split('\n\n')
        .map((p) => `      <p>${boldMarkdown(p)}</p>`)
        .join('\n');
      let html = `
    <section>
      <h2>${escapeHtml(s.heading)}</h2>
      <div class="body">
${paragraphs}
      </div>
    </section>`;
      if (chartMap[i]) {
        html += chartMap[i].join('\n');
      }
      return html;
    })
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
    data.stats.length <= 5 ? `cols-${data.stats.length}` : 'cols-4';

  const hasCharts = (data.charts?.length ?? 0) > 0;

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
      max-width: ${hasCharts ? '860' : '800'}px;
      margin: 0 auto;
      padding: 48px 40px;
      line-height: ${hasCharts ? '1.7' : '1.6'};
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
      font-size: ${hasCharts ? '32' : '36'}px;
      font-weight: 900;
      line-height: 1.15;
      margin-bottom: 10px;
    }
    .subheadline {
      font-size: ${hasCharts ? '16' : '18'}px;
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
      font-size: ${hasCharts ? '17' : '18'}px;
      font-weight: 700;
      color: #ff4400;
      margin-bottom: 12px;${hasCharts ? '\n      padding-bottom: 6px;\n      border-bottom: 1px solid #e5e7eb;' : ''}
    }
    .body p {
      color: #374151;
      margin-bottom: 14px;${hasCharts ? '\n      font-size: 14.5px;' : ''}
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
    .stats-grid.cols-5 { grid-template-columns: 1fr 1fr 1fr 1fr 1fr; }
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
${hasCharts ? `
    /* Chart styles */
    .chart-section { margin-bottom: 36px; }
    .chart-container {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 24px;
      margin-bottom: 20px;
    }
    .chart-title {
      font-size: 13px;
      font-weight: 700;
      color: #6b7280;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .bar-row {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .bar-label {
      width: 140px;
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      flex-shrink: 0;
      text-align: right;
      padding-right: 12px;
    }
    .bar-track {
      flex: 1;
      background: #e5e7eb;
      height: 28px;
      position: relative;
    }
    .bar-fill {
      height: 100%;
      display: flex;
      align-items: center;
      padding-left: 8px;
      font-size: 12px;
      font-weight: 700;
      color: #fff;
      min-width: 36px;
    }
    .bar-fill.primary { background: #ff4400; }
    .bar-fill.dark { background: #111; }
    .bar-fill.muted { background: #6b7280; }
    .timeline {
      position: relative;
      padding-left: 24px;
      border-left: 3px solid #e5e7eb;
    }
    .timeline-item {
      position: relative;
      margin-bottom: 20px;
      padding-left: 20px;
    }
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -33px;
      top: 4px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ff4400;
      border: 3px solid #fff;
      box-shadow: 0 0 0 2px #ff4400;
    }
    .timeline-item.muted::before {
      background: #6b7280;
      box-shadow: 0 0 0 2px #6b7280;
    }
    .timeline-date {
      font-size: 12px;
      font-weight: 700;
      color: #ff4400;
      letter-spacing: 0.05em;
      margin-bottom: 2px;
    }
    .timeline-item.muted .timeline-date { color: #6b7280; }
    .timeline-text {
      font-size: 13.5px;
      color: #374151;
      line-height: 1.5;
    }
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .comparison-box {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 20px;
    }
    .comparison-box h4 {
      font-size: 13px;
      font-weight: 700;
      color: #6b7280;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .comparison-number {
      font-size: 32px;
      font-weight: 900;
      color: #111;
      line-height: 1.1;
    }
    .comparison-number.highlight { color: #ff4400; }
    .comparison-detail {
      font-size: 13px;
      color: #6b7280;
      margin-top: 4px;
    }
    .pipeline-flow {
      display: flex;
      align-items: stretch;
      gap: 0;
      margin: 8px 0;
    }
    .pipeline-stage {
      flex: 1;
      padding: 14px 10px;
      text-align: center;
      font-size: 12px;
      font-weight: 700;
      color: #fff;
    }
    .pipeline-stage.s1 { background: #ff4400; }
    .pipeline-stage.s2 { background: #cc3700; }
    .pipeline-stage.s3 { background: #992900; }
    .pipeline-stage.s4 { background: #111; }
    .pipeline-stage .stage-label {
      font-size: 10px;
      opacity: 0.7;
      display: block;
      margin-bottom: 2px;
      letter-spacing: 0.1em;
    }
` : ''}
    @media print {
      body { padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }
      @page { margin: 0.75in; size: letter; }
      h2 { break-after: avoid; }
      .stat-box { break-inside: avoid; }
      .cta { break-inside: avoid; }
${hasCharts ? `      .bar-row { break-inside: avoid; }
      .timeline-item { break-inside: avoid; }
      .bar-fill, .pipeline-stage, .timeline-item::before { -webkit-print-color-adjust: exact; }
      .bar-fill.primary { background: #ff4400 !important; }
      .bar-fill.dark { background: #111 !important; }
      .bar-fill.muted { background: #6b7280 !important; }
      .bar-track { background: #e5e7eb !important; }
      .pipeline-stage.s1 { background: #ff4400 !important; }
      .pipeline-stage.s2 { background: #cc3700 !important; }
      .pipeline-stage.s3 { background: #992900 !important; }
      .pipeline-stage.s4 { background: #111 !important; }
      .timeline-item::before { background: #ff4400 !important; box-shadow: 0 0 0 2px #ff4400 !important; }
      .timeline-item.muted::before { background: #6b7280 !important; box-shadow: 0 0 0 2px #6b7280 !important; }
      .comparison-number.highlight { color: #ff4400 !important; }
      .stat-box, .comparison-box, .chart-container { background: #f9fafb !important; -webkit-print-color-adjust: exact; }
      h2 { color: #ff4400 !important; }
` : '      section { break-inside: avoid; }\n'}    }
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
    <h2>${hasCharts ? 'Key Figures' : 'By the Numbers'}</h2>
    <div class="stats-grid ${statsColClass}">
${statsHtml}
    </div>
  </div>
  <div class="cta">
    <p><strong>${hasCharts ? 'Point of Contact:' : 'Next Step:'}</strong> <span>${escapeHtml(data.cta)}</span></p>
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
