// LLM-based context extraction from meeting notes
// Uses small, focused prompts to minimize token usage

import { MeetingContext, Industry, Persona } from './types';

const EXTRACTION_SYSTEM_PROMPT = `You extract structured data from meeting notes. Output valid JSON only, no explanation.`;

const EXTRACTION_USER_PROMPT = `Extract meeting context from these notes. Return JSON:

{
  "company": "company name mentioned",
  "attendees": ["names of people in the meeting"],
  "industry": "healthcare" | "financial" | "enterprise" | "smb" | null,
  "painPoints": ["security concerns or challenges mentioned"],
  "nextSteps": ["agreed follow-up actions"],
  "persona": "ciso" | "cti" | "soc" | "vendor-risk" | null,
  "topicsDiscussed": ["main topics covered"]
}

Industry detection:
- healthcare: hospitals, clinics, HIPAA, patient data, medical
- financial: banks, insurance, trading, compliance, SOX, PCI
- smb: small business, under 500 employees, limited budget
- enterprise: Fortune 500, large scale, complex environments

Persona detection:
- ciso: CISO, VP Security, security executive, board reporting
- cti: threat intel, CTI, analyst, IOCs, threat hunting
- soc: SOC, security operations, alerts, monitoring, SIEM
- vendor-risk: third-party risk, TPRM, vendor management, supply chain

Meeting notes:
"""
{notes}
"""`;

export async function extractContext(
  notes: string,
  company: string,
  apiKey?: string
): Promise<MeetingContext> {
  // If no API key, return minimal context
  if (!apiKey) {
    return {
      company,
      topicsDiscussed: notes.split('\n').filter(line => line.trim()).slice(0, 5),
    };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        system: EXTRACTION_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: EXTRACTION_USER_PROMPT.replace('{notes}', notes),
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('API error:', response.status);
      return { company };
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '{}';

    // Parse the JSON response
    const extracted = JSON.parse(text) as Partial<MeetingContext>;

    return {
      company: extracted.company || company,
      attendees: extracted.attendees,
      industry: extracted.industry as Industry | undefined,
      painPoints: extracted.painPoints,
      nextSteps: extracted.nextSteps,
      persona: extracted.persona as Persona | undefined,
      topicsDiscussed: extracted.topicsDiscussed,
    };
  } catch (error) {
    console.error('Extraction error:', error);
    return { company };
  }
}

// Estimate token count (rough approximation)
export function estimateTokens(text: string): number {
  // ~4 chars per token on average
  return Math.ceil(text.length / 4);
}
