// Usage: node render-onepager.js <input.json> <output.html> [product_label]
const fs = require('fs');

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const productLabel = process.argv[4] || '';

const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function renderSection(s) {
  const lines = s.body.split('\n');
  const isTable = lines.filter(l => l.includes('\u2192')).length >= 3;

  if (isTable) {
    const rows = lines.filter(l => l.trim()).map(l => {
      const parts = l.split('\u2192').map(p => p.trim());
      return '            <tr><td>' + esc(parts[0]) + '</td><td>' + esc(parts[1] || '') + '</td></tr>';
    }).join('\n');
    return `    <section>
      <h2>${esc(s.heading)}</h2>
      <table class="compare">
        <thead><tr><th>Traditional Approach</th><th>DarkWebIQ</th></tr></thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </section>`;
  }

  const paragraphs = s.body.split('\n\n').map(p => {
    if (p.startsWith('"') || p.startsWith('\u201c'))
      return '      <blockquote>' + esc(p) + '</blockquote>';
    return '      <p>' + esc(p) + '</p>';
  }).join('\n');

  return `    <section>
      <h2>${esc(s.heading)}</h2>
      <div class="body">
${paragraphs}
      </div>
    </section>`;
}

const sections = data.sections.map(renderSection).join('\n\n');
const stats = data.stats.slice(0, 4).map(s =>
  `        <div class="stat-box"><div class="stat-number">${esc(String(s.number))}</div><div class="stat-label">${esc(s.label)}</div></div>`
).join('\n');

const labelHtml = productLabel
  ? `<div class="product-label">${esc(productLabel)}</div>`
  : '';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DarkWebIQ - ${esc(data.headline)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; max-width: 800px; margin: 0 auto; padding: 48px 40px; line-height: 1.6; }
    header { border-bottom: 4px solid #000; padding-bottom: 20px; margin-bottom: 32px; }
    .product-label { font-size: 11px; font-weight: 700; letter-spacing: .2em; color: #ff4400; text-transform: uppercase; margin-bottom: 10px; }
    h1 { font-size: 30px; font-weight: 900; line-height: 1.1; margin-bottom: 8px; }
    .subheadline { font-size: 16px; color: #4b5563; line-height: 1.45; }
    section { margin-bottom: 28px; break-inside: avoid; }
    h2 { font-size: 16px; font-weight: 700; color: #ff4400; margin-bottom: 10px; }
    .body p { color: #374151; margin-bottom: 12px; font-size: 14px; }
    .body p:last-child { margin-bottom: 0; }
    blockquote { color: #374151; font-style: italic; font-size: 13px; border-left: 3px solid #ff4400; padding-left: 12px; margin: 12px 0; }
    .compare { width: 100%; border-collapse: collapse; font-size: 13px; }
    .compare thead { border-bottom: 2px solid #000; }
    .compare th { text-align: left; padding: 6px 8px; font-weight: 700; font-size: 12px; }
    .compare td { padding: 5px 8px; color: #374151; border-bottom: 1px solid #e5e7eb; }
    .compare td:first-child { color: #9ca3af; }
    .compare td:last-child { font-weight: 600; color: #111; }
    .stats-section { margin-bottom: 28px; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: center; }
    .stat-box { background: #f3f4f6; padding: 14px 10px; }
    .stat-number { font-size: 26px; font-weight: 900; }
    .stat-label { font-size: 12px; color: #6b7280; margin-top: 2px; }
    .cta { border-top: 2px solid #000; padding-top: 20px; }
    .cta p { font-size: 14px; }
    .cta strong { font-weight: 700; }
    .cta span { color: #374151; }
    .no-print { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .no-print button { background: #000; color: #fff; padding: 12px 24px; font-weight: 700; font-size: 13px; letter-spacing: .2em; text-transform: uppercase; border: none; cursor: pointer; }
    .no-print button:hover { background: #ff4400; }
    .no-print .tip { font-size: 12px; color: #6b7280; margin-top: 8px; }
    @media print { body { padding: 0; } .no-print { display: none !important; } @page { margin: .6in; size: letter; } }
  </style>
</head>
<body>
  <header>
    <img src="logo-on-white.png" alt="DarkWebIQ" style="height:40px;margin-bottom:6px">
    ${labelHtml}
    <h1>${esc(data.headline)}</h1>
    <p class="subheadline">${esc(data.subheadline)}</p>
  </header>

${sections}

  <div class="stats-section">
    <h2>By the Numbers</h2>
    <div class="stats-grid">
${stats}
    </div>
  </div>

  <div class="cta">
    <p><strong>Next Step:</strong> <span>${esc(data.cta)}</span></p>
  </div>

  <div class="no-print">
    <button onclick="window.print()">Save as PDF</button>
    <p class="tip">Tip: In the print dialog, uncheck "Headers and footers" for a clean PDF.</p>
  </div>
</body>
</html>`;

fs.writeFileSync(outputFile, html);
console.log('Rendered: ' + outputFile);
