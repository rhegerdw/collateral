// Collateral Generator - Main Entry Point
// Orchestrates extraction, selection, and template filling

import { GenerationRequest, GenerationResult, MeetingContext, EmailTemplate } from './types';
import { extractContext } from './extractor';
import { selectContent } from './selector';
import { EMAIL_TEMPLATES, generateOnePager, onePagerToMarkdown, formatEmailForDisplay } from './templates';

export async function generateCollateral(
  request: GenerationRequest,
  apiKey?: string
): Promise<GenerationResult> {
  // Step 1: Extract context from meeting notes using LLM
  const context = await extractContext(request.notes, request.company, apiKey);

  // Override with user-provided values if specified
  if (request.industry) {
    context.industry = request.industry;
  }
  if (request.persona) {
    context.persona = request.persona;
  }

  // Step 2: Select content blocks based on context
  const blocks = selectContent(context);

  // Step 3: Generate output based on type
  if (request.outputType === 'email') {
    const templateKey: EmailTemplate = request.emailTemplate || 'post-meeting';
    const template = EMAIL_TEMPLATES[templateKey];
    const email = template(blocks, context);

    return {
      type: 'email',
      email,
      context,
    };
  }

  // One-pager
  const onePager = generateOnePager(blocks, context);

  return {
    type: 'one-pager',
    onePager,
    context,
  };
}

// Re-export utilities for UI
export { onePagerToMarkdown, formatEmailForDisplay };
export type { GenerationRequest, GenerationResult, MeetingContext, EmailTemplate };
export type { Industry, Persona, OutputType } from './types';
