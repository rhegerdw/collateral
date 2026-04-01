import Anthropic from '@anthropic-ai/sdk';
import { EnhancedOnePager, EnhanceRequest, Industry } from '@/lib/collateral/types';
import { buildEnhancePrompt, parseLLMResponse } from '@/lib/collateral/enhancer';
import { validateAndFix } from '@/lib/collateral/brand-validator';

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EnhanceRequest;

    if (!body.content || !body.company || !body.industry || !body.persona || !body.format) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { system, user, maxTokens } = buildEnhancePrompt(body);

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    });

    const raw = response.content[0];
    if (raw.type !== 'text') {
      return Response.json({ error: 'Unexpected response type' }, { status: 500 });
    }

    const parsed = parseLLMResponse(raw.text);

    const document: EnhancedOnePager = {
      headline: (parsed.headline as string) || '',
      subheadline: (parsed.subheadline as string) || '',
      company: body.company,
      industry: body.industry as Industry,
      sections: (parsed.sections as EnhancedOnePager['sections']) || [],
      stats: (parsed.stats as EnhancedOnePager['stats']) || [],
      charts: (parsed.charts as EnhancedOnePager['charts']) || undefined,
      cta: (parsed.cta as string) || '',
    };

    // Run brand validator
    const { fixed, violations } = validateAndFix(document);

    return Response.json({ document: fixed, violations });
  } catch (err) {
    console.error('Generate error:', err);
    const message = err instanceof Error ? err.message : 'Generation failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
