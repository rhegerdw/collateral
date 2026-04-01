import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'fs';

const client = new Anthropic();

const content = readFileSync('/Users/rheger/collateral/Q12026.md', 'utf-8');

const SYSTEM_PROMPT = `You are a cybersecurity marketing copywriter for DarkWebIQ, a dark web threat intelligence company.

Brand voice:
- Bold, direct, no-nonsense
- Lead with outcomes, not features
- Use specific numbers, names, technical details, and proof points — these are what make collateral credible
- Confident, urgent, credible tone

DarkWebIQ's core value prop: We develop one-on-one relationships with threat actors using misattributable personas, purchasing compromised network access before attackers can use it — intercepting access before ransomware execution.

Key positioning:
- We do NOT just "monitor marketplaces" — we infiltrate criminal networks through direct engagement with threat actors
- Human-led intelligence, not automated scraping
- Every alert is analyst-vetted (never say "verified" or "zero false positives")
- We intercept ACCESS before ransomware execution (never say "intercept ransomware")

Current stats (2025): 769 interceptions, 7,563 access offers identified, 23 days average warning, $10.22M average US breach cost (IBM 2025).

Output valid JSON only. Do not wrap in markdown code fences.`;

const USER_PROMPT = `Take this raw intelligence content and produce a polished, publication-ready threat intelligence report. This is NOT marketing collateral — it is an analytical report for security professionals. Preserve the analytical rigor, sourcing language, and assessment confidence levels from the source material.

Target persona: ciso
Target industry: enterprise
Prepared for: DarkWebIQ

Raw content:
"""
${content}
"""

Return JSON:

{
  "headline": "Report title — clear, descriptive, no clickbait (e.g. 'Q1 2026 Threat Landscape Report')",
  "subheadline": "One-line scope statement (e.g. 'Quarterly intelligence summary covering IAB ecosystem developments, emerging platforms, and offensive tooling trends')",
  "sections": [
    {
      "heading": "Section title",
      "body": "Full analytical paragraphs. Preserve ALL sourcing details, timelines, actor names, technical specifications, assessment language, and operational context. Multiple paragraphs separated by \\n\\n."
    }
  ],
  "stats": [
    { "number": "28%", "label": "Short metric label" }
  ],
  "cta": "Next step or point of contact"
}

CRITICAL RULES:
- This is an INTELLIGENCE REPORT, not a sales document. Write in analytical prose — no marketing language, no hype, no calls-to-action within the body.
- Preserve DWIQ assessment language ("DWIQ assesses...", "assessed ties to...", "consistent with..."). Do not soften or marketize analytical judgments.
- Preserve ALL specifics: actor names, forum names, CVEs, prices, dates, technical specs, protocol lists, tool names, payment figures, victim counts.
- Preserve sourcing and collection details — how DWIQ obtained the information (direct engagement, undercover operatives, forum monitoring). This is what makes the report credible.
- Structure sections to follow the natural analytical flow of the source. Each major topic should be its own section. Use subsections within body text via bold markers where appropriate.
- If the source contains defensive recommendations, keep them as a distinct section.
- If the source references DWIQ's prior reporting, preserve those references.
- stats array: pull the 3-5 most significant quantifiable data points from the source.
- Do NOT invent facts, statistics, or assessments. Only use what is in the source material.
- Do NOT anonymize — this is a report, not a case study. Keep all names as-is.
- Clean up prose for clarity and flow, but NEVER cut substantive detail.`;

console.log('Calling Claude API...');
const response = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 8000,
  system: SYSTEM_PROMPT,
  messages: [{ role: 'user', content: USER_PROMPT }],
});

const raw = response.content[0];
if (raw.type !== 'text') throw new Error('Unexpected response type');

const text = raw.text.replace(/^```json?\s*/, '').replace(/\s*```\s*$/, '').trim();
const parsed = JSON.parse(text);

const doc = {
  headline: parsed.headline || '',
  subheadline: parsed.subheadline || '',
  company: 'DarkWebIQ',
  industry: 'enterprise',
  sections: parsed.sections || [],
  stats: parsed.stats || [],
  cta: parsed.cta || '',
};

// Brand validation
const DENY_RULES = [
  { pattern: /zero false positives?/gi, replacement: 'analyst-vetted alerts', rule: 'no-absolute-claims' },
  { pattern: /\bverified\s+(threats?|alerts?|intelligence|findings?)/gi, replacement: 'vetted $1', rule: 'brand-terminology' },
  { pattern: /monitor(?:ing|s)?\s+(?:criminal\s+)?(?:dark\s*web\s+)?marketplaces?/gi, replacement: 'developing relationships with threat actors through misattributable personas', rule: 'positioning' },
  { pattern: /intercepts?\s+ransomware/gi, replacement: 'intercept access before ransomware execution', rule: 'brand-terminology' },
  { pattern: /Dark\s*Web\s+IQ\b/g, replacement: 'DarkWebIQ', rule: 'brand-spelling' },
  { pattern: /Darkweb\s*IQ\b/g, replacement: 'DarkWebIQ', rule: 'brand-spelling' },
];

function fix(text) {
  let result = text;
  for (const rule of DENY_RULES) {
    result = result.replace(rule.pattern, rule.replacement);
  }
  return result;
}

doc.headline = fix(doc.headline);
doc.subheadline = fix(doc.subheadline);
doc.sections = doc.sections.map(s => ({ heading: fix(s.heading), body: fix(s.body) }));
doc.cta = fix(doc.cta);

// Render HTML
function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const sectionsHtml = doc.sections.map(s => {
  const paragraphs = s.body.split('\n\n').map(p => `      <p>${esc(p)}</p>`).join('\n');
  return `
    <section>
      <h2>${esc(s.heading)}</h2>
      <div class="body">
${paragraphs}
      </div>
    </section>`;
}).join('\n');

const statsHtml = doc.stats.map(s => `
        <div class="stat-box">
          <div class="stat-number">${esc(String(s.number))}</div>
          <div class="stat-label">${esc(s.label)}</div>
        </div>`).join('\n');

const colClass = `cols-${Math.min(doc.stats.length, 5)}`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DarkWebIQ - ${esc(doc.headline)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #111;
      max-width: 860px;
      margin: 0 auto;
      padding: 48px 40px;
      line-height: 1.7;
      background: #fff;
    }
    header {
      border-bottom: 4px solid #000;
      padding-bottom: 28px;
      margin-bottom: 40px;
    }
    .brand {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .report-type {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #fff;
      background: #ff4400;
      padding: 3px 10px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 32px;
      font-weight: 900;
      line-height: 1.2;
      margin-bottom: 12px;
    }
    .subheadline {
      font-size: 16px;
      color: #4b5563;
      line-height: 1.5;
      margin-bottom: 12px;
    }
    .meta {
      font-size: 13px;
      color: #9ca3af;
    }
    .meta strong { color: #6b7280; }
    section {
      margin-bottom: 36px;
    }
    h2 {
      font-size: 17px;
      font-weight: 700;
      color: #ff4400;
      margin-bottom: 14px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e5e7eb;
    }
    .body p {
      color: #374151;
      margin-bottom: 16px;
      font-size: 14.5px;
    }
    .body p:last-child { margin-bottom: 0; }
    .stats-section { margin-bottom: 36px; }
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
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 18px 12px;
    }
    .stat-number {
      font-size: 22px;
      font-weight: 900;
      color: #111;
    }
    .stat-label {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }
    .cta {
      border-top: 2px solid #000;
      padding-top: 24px;
    }
    .cta p { font-size: 14px; }
    .cta strong { font-weight: 700; }
    .cta span { color: #374151; }
    .classification {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: #9ca3af;
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    @media print {
      body { padding: 0; max-width: 100%; }
      @page { margin: 0.75in; size: letter; }
      section { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">DARKWEBIQ</div>
    <div class="report-type">Threat Intelligence Report</div>
    <h1>${esc(doc.headline)}</h1>
    <p class="subheadline">${esc(doc.subheadline)}</p>
    <p class="meta"><strong>Q1 2026</strong> &mdash; Published April 2026 &mdash; Classification: <strong>TLP:AMBER</strong></p>
  </header>
${sectionsHtml}
  <div class="stats-section">
    <h2>Key Figures</h2>
    <div class="stats-grid ${colClass}">
${statsHtml}
    </div>
  </div>
  <div class="cta">
    <p><strong>Point of Contact:</strong> <span>${esc(doc.cta)}</span></p>
  </div>
  <div class="classification">DARKWEBIQ &mdash; CONFIDENTIAL</div>
</body>
</html>`;

writeFileSync('/Users/rheger/collateral/Q1-2026-Report.html', html);
console.log('Done! Written to Q1-2026-Report.html');
console.log(`Sections: ${doc.sections.length}, Stats: ${doc.stats.length}`);
