// LLM-based collateral enhancer
// Pure prompt construction — API calls happen in server-side route handlers

import { EnhancedOnePager, Industry, Persona, OutputType } from './types';

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

const CASE_STUDY_PROMPT = `Take this raw collateral and rewrite it as an enhanced case study. KEEP ALL THE DETAIL — every stat, every name, every technical detail, every outcome. Rewrite for clarity and impact, not brevity.

Target persona: {persona}
Target industry: {industry}
Company to prepare for: {company}

Raw collateral content:
"""
{content}
"""

Return JSON:

{
  "headline": "Bold headline that captures the core story (3-8 words, no period)",
  "subheadline": "One sentence that sets up the narrative",
  "sections": [
    {
      "heading": "Section title",
      "body": "Rich paragraph(s) with ALL the detail from the source material. Multiple paragraphs separated by \\n\\n. Include specific names, numbers, technical details, timelines, outcomes."
    }
  ],
  "stats": [
    { "number": "$249.6M", "label": "Short metric label" }
  ],
  "cta": "Clear next step action"
}

CRITICAL RULES:
- sections should follow the natural narrative arc of the source material. Use as many sections as needed (typically 3-6).
- Each section body should be RICH — full paragraphs, not bullet points. Include every specific detail from the source.
- If the source has a threat actor profile, keep ALL the details (what groups they supplied, their methods, their fate).
- If the source has technical details (protocols, tools, lateral movement, enumeration), keep them ALL. A CISO reading this wants to see RDP, SMB, WinRM, credential dumps — that's what makes it real.
- If the source has an intervention narrative, tell the full story with timeline and specifics.
- If the source has outcomes for multiple parties (victim, law enforcement, industry), cover ALL of them in separate paragraphs.
- stats array: pull every quantifiable metric from the source. Limit to 4 stats max.
- ANONYMIZE the protected entity/victim. Replace their specific name with a description of the type of firm (e.g. "a leading pharmacy care management company serving patients in all 50 states" NOT "Tabula Rasa Healthcare"). Keep all other specifics — revenue, patient count, geography, technical details, threat actor details.
- Do NOT invent facts. Only use what's in the source material.
- Rewrite for punch and clarity, but NEVER cut detail to save space.`;

const ONE_PAGER_PROMPT = `Take this raw collateral and rewrite it as a scannable one-pager. Condense into key sections but keep the most important specific details — don't genericize.

Target persona: {persona}
Target industry: {industry}
Company to prepare for: {company}

Raw collateral content:
"""
{content}
"""

Return JSON:

{
  "headline": "Bold 3-6 word headline (no period)",
  "subheadline": "One sentence value prop",
  "sections": [
    {
      "heading": "Section title",
      "body": "Concise but specific paragraph. Keep real names, real numbers, real technical details. Cut generic filler, not facts."
    }
  ],
  "stats": [
    { "number": "847", "label": "Short metric label" }
  ],
  "cta": "Clear next step action"
}

RULES:
- Aim for 3-4 sections max. Each section should be 2-4 sentences.
- Keep the most compelling specific details — names, numbers, protocols, outcomes.
- Cut generic marketing language, NOT factual specifics.
- stats: pull the top 2-4 quantifiable metrics from the source.
- Do NOT invent facts.`;

const DATASHEET_PROMPT = `Take this raw collateral and rewrite it as a product datasheet. Structure it as a scannable reference document that a technical buyer would keep on file.

Target persona: {persona}
Target industry: {industry}
Company to prepare for: {company}

Raw collateral content:
"""
{content}
"""

Return JSON:

{
  "headline": "Product/capability name (3-6 words, no period)",
  "subheadline": "One sentence that states what it does and who it's for",
  "sections": [
    {
      "heading": "Section title (e.g. Overview, Key Capabilities, How It Works, Integration, Use Cases)",
      "body": "Clear, specific content. Use bullet-style formatting where appropriate (one item per line with - prefix). Include technical specs, integration details, and concrete capabilities."
    }
  ],
  "stats": [
    { "number": "769", "label": "Short metric label" }
  ],
  "cta": "Clear next step action"
}

RULES:
- Use 4-6 sections covering: Overview, Key Capabilities, How It Works, Integration/Deployment, Use Cases.
- Keep it factual and specific — datasheets are reference docs, not marketing fluff.
- Include technical details: APIs, formats, delivery methods, integration points.
- stats: pull 3-4 quantifiable proof points.
- Do NOT invent facts.`;

const EMAIL_PROMPT = `Take this raw collateral and write a concise, personalized email. The email should be direct and value-focused — no fluff.

Target persona: {persona}
Target industry: {industry}
Company to prepare for: {company}

Raw collateral content:
"""
{content}
"""

Return JSON:

{
  "headline": "Email subject line (compelling, under 60 chars)",
  "subheadline": "Preview text / first line hook",
  "sections": [
    {
      "heading": "Opening",
      "body": "2-3 sentences. Reference something specific to their situation. Get to the point fast."
    },
    {
      "heading": "Value",
      "body": "2-3 sentences. One specific proof point or case study relevant to their industry."
    },
    {
      "heading": "Ask",
      "body": "1-2 sentences. Clear, low-friction next step."
    }
  ],
  "stats": [
    { "number": "769", "label": "Short metric label" }
  ],
  "cta": "Specific next step (e.g. '15-min call this week')"
}

RULES:
- Keep the total email under 200 words.
- Be specific, not generic. Reference their industry, their likely pain points.
- One proof point only — don't overwhelm.
- stats: 1-2 most relevant metrics.
- Do NOT invent facts.`;

// Prompt registry keyed by output type
export const PROMPTS: Record<OutputType, { userPrompt: string; maxTokens: number }> = {
  'case-study': { userPrompt: CASE_STUDY_PROMPT, maxTokens: 4000 },
  'one-pager': { userPrompt: ONE_PAGER_PROMPT, maxTokens: 2000 },
  'datasheet': { userPrompt: DATASHEET_PROMPT, maxTokens: 3000 },
  'email': { userPrompt: EMAIL_PROMPT, maxTokens: 1500 },
};

export const ENHANCE_SYSTEM_PROMPT = SYSTEM_PROMPT;

export function buildEnhancePrompt(request: {
  content: string;
  company: string;
  industry: Industry;
  persona: Persona;
  format: OutputType;
}): { system: string; user: string; maxTokens: number } {
  const config = PROMPTS[request.format];

  const user = config.userPrompt
    .replace('{content}', request.content)
    .replace('{company}', request.company)
    .replace('{industry}', request.industry)
    .replace('{persona}', request.persona);

  return {
    system: SYSTEM_PROMPT,
    user,
    maxTokens: config.maxTokens,
  };
}

export function buildEditPrompt(request: {
  instruction: string;
  currentDocument: EnhancedOnePager;
  sectionIndex?: number | null;
}): { system: string; user: string; maxTokens: number } {
  const { instruction, currentDocument, sectionIndex } = request;

  if (sectionIndex != null && sectionIndex >= 0 && sectionIndex < currentDocument.sections.length) {
    // Section-scoped edit
    const section = currentDocument.sections[sectionIndex];
    const contextHeadings = currentDocument.sections.map((s, i) =>
      i === sectionIndex ? `[EDITING] ${s.heading}` : s.heading
    );

    return {
      system: SYSTEM_PROMPT,
      user: `You are editing a specific section of a DarkWebIQ collateral document.

Document headline: "${currentDocument.headline}"
Document sections: ${contextHeadings.join(' | ')}

Section being edited:
{
  "heading": ${JSON.stringify(section.heading)},
  "body": ${JSON.stringify(section.body)}
}

User instruction: "${instruction}"

Return the updated section as JSON:
{
  "heading": "Updated heading (or same if unchanged)",
  "body": "Updated body text"
}

RULES:
- Only change what the user asked for. Preserve everything else exactly.
- Output valid JSON only, no markdown fences.`,
      maxTokens: 2000,
    };
  }

  // Whole-document edit
  return {
    system: SYSTEM_PROMPT,
    user: `You are editing a DarkWebIQ collateral document. Here is the current document as JSON:

${JSON.stringify(currentDocument, null, 2)}

User instruction: "${instruction}"

Return the FULL updated document as JSON with the same structure:
{
  "headline": "...",
  "subheadline": "...",
  "sections": [...],
  "stats": [...],
  "cta": "..."
}

RULES:
- Only change what the user asked for. Preserve everything else exactly.
- Keep the same JSON structure.
- Output valid JSON only, no markdown fences.`,
    maxTokens: 4000,
  };
}

// Parse raw LLM text response into structured data
export function parseLLMResponse(raw: string): Record<string, unknown> {
  const text = raw.replace(/^```json?\s*/, '').replace(/\s*```\s*$/, '').trim();
  return JSON.parse(text);
}
