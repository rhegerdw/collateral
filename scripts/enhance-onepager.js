// Usage: ANTHROPIC_API_KEY=... node enhance-onepager.js <source_text_file> <product_name> <output_json_file>
const fs = require('fs');

const sourceFile = process.argv[2];
const productName = process.argv[3];
const outputFile = process.argv[4];

if (!sourceFile || !productName || !outputFile) {
  console.error('Usage: node enhance-onepager.js <source.txt> <product_name> <output.json>');
  process.exit(1);
}

const sourceText = fs.readFileSync(sourceFile, 'utf-8');

const SYSTEM = `You are rewriting DarkWebIQ product collateral. Follow these rules exactly:

BRAND VOICE:
- Bold, direct, no-nonsense. Specific numbers and proof points.
- Lead with outcomes, not features.

MANDATORY LANGUAGE RULES:
- NEVER use "zero false positives" — there are some false positives. Say "analyst-vetted alerts" instead.
- Alerts are "vetted", NEVER "verified."
- NEVER describe us as "monitoring marketplaces" or "tracking listings." We develop one-on-one relationships with threat actors using misattributable personas. We receive access offers directly from threat actors — we don't scrape or monitor.
- Use "human-led intelligence" not "crypto intelligence and human intelligence."

CURRENT STATS (use these, not whatever is in the source material):
- 769 attacks intercepted in 2025
- 7,563 access offers received directly from threat actors in 2025
- 23 days average warning before attack execution
- $10.22 million: US average breach cost in 2025 (IBM, record high, up 9% YoY)
- 25% of breaches start with stolen credentials from access brokers
- Healthcare breach cost: $5.08 million (Baker Donelson, 2025)

CORE POSITIONING:
- We infiltrate criminal networks and buy compromised access before attackers can use it
- We intercept ACCESS before ransomware execution (not "intercept ransomware")
- Our human-led intelligence has directly resulted in the arrest, extradition, and indictment of prolific ransomware access brokers
- When we intercept an attack, we don't just protect the victim — we take the threat actor off the board

Output valid JSON only. Do not wrap in markdown code fences.`;

const USER = `Rewrite this old DarkWebIQ "${productName}" collateral as a sharp, modern one-pager.

SOURCE MATERIAL:
"""
${sourceText}
"""

Return JSON:
{
  "headline": "Bold 3-8 word headline, no period",
  "subheadline": "One sentence hook",
  "sections": [
    {
      "heading": "Section title",
      "body": "2-4 sentences per section. Keep real facts. Use \\n\\n between paragraphs."
    }
  ],
  "stats": [
    { "number": "769", "label": "Short label" }
  ],
  "cta": "Clear next step"
}

RULES:
- 4-5 sections max, each 2-4 sentences.
- Stats: pick the 4 most relevant to this product. Use CURRENT stats from the system prompt, not the old ones in the source.
- Weave 1-2 testimonials from the source into sections (not a separate section). Keep exact quotes.
- Include a compact comparison table where relevant (use → between old and new approach).
- Keep all real product-specific facts from the source.
- Do NOT invent facts. Do NOT use "zero false positives" or "verified."`;

async function run() {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: SYSTEM,
      messages: [{ role: 'user', content: USER }],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error('API error ' + resp.status + ': ' + err);
  }

  const data = await resp.json();
  const raw = data.content[0].text.replace(/^```json?\s*/, '').replace(/\s*```\s*$/, '').trim();
  const result = JSON.parse(raw);
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
  console.log('Written: ' + outputFile);
}

run().catch(e => { console.error(e); process.exit(1); });
