const JSZip = require('jszip');
const fs = require('fs');

async function extractPptx() {
  const buffer = fs.readFileSync('/Users/rheger/collateral/Resilience Op Win.pptx');
  const zip = await JSZip.loadAsync(buffer);
  const slideFiles = [];
  zip.forEach((path) => {
    const match = path.match(/^ppt\/slides\/slide(\d+)\.xml$/);
    if (match) slideFiles.push({ num: parseInt(match[1]), path });
  });
  slideFiles.sort((a, b) => a.num - b.num);
  let md = '# Resilience Op Win\n';
  for (const entry of slideFiles) {
    const xml = await zip.file(entry.path).async('string');
    const pRegex = /<a:p[^>]*>(.*?)<\/a:p>/gs;
    const paragraphs = [];
    let pMatch;
    while ((pMatch = pRegex.exec(xml)) !== null) {
      const tRegex = /<a:t>(.*?)<\/a:t>/gs;
      let text = '';
      let tMatch;
      while ((tMatch = tRegex.exec(pMatch[1])) !== null) text += tMatch[1];
      const trimmed = text.trim();
      if (trimmed) paragraphs.push(trimmed);
    }
    if (paragraphs.length > 0) {
      md += '\n## Slide ' + entry.num + '\n';
      paragraphs.forEach((p, i) => {
        md += (i === 0 && p.length < 100 ? '**' + p + '**' : '- ' + p) + '\n';
      });
    }
  }
  return md;
}

async function enhance(content) {
  const SYSTEM = [
    'You are a cybersecurity marketing copywriter for DarkWebIQ, a dark web threat intelligence company.',
    '',
    'Brand voice:',
    '- Bold, direct, no-nonsense',
    '- Lead with outcomes, not features',
    '- Use specific numbers, names, technical details, and proof points',
    '- Confident, urgent, credible tone',
    '',
    'DarkWebIQ core value prop: We buy compromised network access from criminal marketplaces before attackers can use it.',
    '',
    'Output valid JSON only. Do not wrap in markdown code fences.'
  ].join('\n');

  const USER = [
    'Take this raw collateral and rewrite it as an enhanced case study. KEEP ALL THE DETAIL.',
    '',
    'Target persona: ciso',
    'Target industry: healthcare',
    'Company to prepare for: Resilience',
    '',
    'Raw collateral content:',
    '"""',
    content,
    '"""',
    '',
    'Return JSON:',
    '',
    '{',
    '  "headline": "Bold headline, 3-8 words, no period",',
    '  "subheadline": "One sentence that sets up the narrative",',
    '  "sections": [',
    '    {',
    '      "heading": "Section title",',
    '      "body": "Rich paragraphs with ALL detail. Use \\\\n\\\\n between paragraphs."',
    '    }',
    '  ],',
    '  "stats": [',
    '    { "number": "$249.6M", "label": "Short metric label" }',
    '  ],',
    '  "cta": "Clear next step action"',
    '}',
    '',
    'CRITICAL RULES:',
    '- sections should follow the natural narrative arc. Use 3-6 sections.',
    '- Each section body: RICH full paragraphs. Include every specific detail.',
    '- Threat actor profiles: keep ALL details (groups supplied, methods, fate).',
    '- Technical details: keep ALL (RDP, SMB, WinRM, credential dumps, etc). CISOs want specifics.',
    '- Intervention narratives: full story with timeline and specifics.',
    '- Multiple outcomes (victim, law enforcement): cover ALL separately.',
    '- stats: pull top 4 quantifiable metrics from the source. Max 4 stats.',
    '- ANONYMIZE the protected entity/victim. Replace their name with a description of the type of firm (e.g. "a leading pharmacy care management company" NOT "Tabula Rasa Healthcare"). Keep all other specifics — revenue, patient count, geography, technical details, threat actor details.',
    '- Do NOT invent facts.',
    '- Rewrite for punch and clarity, but NEVER cut detail to save space.'
  ].join('\n');

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM,
      messages: [{ role: 'user', content: USER }],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error('API error ' + resp.status + ': ' + err);
  }
  const data = await resp.json();
  const raw = data.content[0].text;
  const cleaned = raw.replace(/^```json?\s*/, '').replace(/\s*```\s*$/, '').trim();
  return JSON.parse(cleaned);
}

async function run() {
  const md = await extractPptx();
  console.error('Enhancing via Claude Sonnet (case study mode)...');
  const result = await enhance(md);
  // Output JSON to stdout
  console.log(JSON.stringify(result, null, 2));
}

run().catch((err) => { console.error(err); process.exit(1); });
