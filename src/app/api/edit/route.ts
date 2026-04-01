import Anthropic from '@anthropic-ai/sdk';
import { EditRequest, EditResponse, EnhancedOnePager } from '@/lib/collateral/types';
import { buildEditPrompt, parseLLMResponse } from '@/lib/collateral/enhancer';
import { validateAndFix } from '@/lib/collateral/brand-validator';

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EditRequest;

    if (!body.instruction || !body.currentDocument) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { system, user, maxTokens } = buildEditPrompt(body);

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

    let updatedDocument: EnhancedOnePager;

    if (body.sectionIndex != null && body.sectionIndex >= 0) {
      // Section-scoped edit — merge the updated section back into the document
      updatedDocument = {
        ...body.currentDocument,
        sections: body.currentDocument.sections.map((section, i) =>
          i === body.sectionIndex
            ? {
                heading: (parsed.heading as string) || section.heading,
                body: (parsed.body as string) || section.body,
              }
            : section
        ),
      };
    } else {
      // Whole-document edit
      updatedDocument = {
        headline: (parsed.headline as string) || body.currentDocument.headline,
        subheadline: (parsed.subheadline as string) || body.currentDocument.subheadline,
        company: body.currentDocument.company,
        industry: body.currentDocument.industry,
        sections: (parsed.sections as EnhancedOnePager['sections']) || body.currentDocument.sections,
        stats: (parsed.stats as EnhancedOnePager['stats']) || body.currentDocument.stats,
        cta: (parsed.cta as string) || body.currentDocument.cta,
      };
    }

    // Run brand validator
    const { fixed, violations } = validateAndFix(updatedDocument);

    const editResponse: EditResponse = {
      updatedDocument: fixed,
      changeDescription: body.instruction,
      violations,
    };

    return Response.json(editResponse);
  } catch (err) {
    console.error('Edit error:', err);
    const message = err instanceof Error ? err.message : 'Edit failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
