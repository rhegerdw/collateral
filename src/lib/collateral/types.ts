// Collateral Generator Types

export type Industry = 'healthcare' | 'financial' | 'enterprise' | 'smb';
export type Persona = 'ciso' | 'cti' | 'soc' | 'vendor-risk';
export type OutputType = 'email' | 'one-pager';
export type EmailTemplate = 'post-meeting' | 'cold-outreach' | 'threat-update' | 'event-follow-up';

export interface MeetingContext {
  company: string;
  attendees?: string[];
  industry?: Industry;
  painPoints?: string[];
  nextSteps?: string[];
  persona?: Persona;
  topicsDiscussed?: string[];
}

export interface ContentBlocks {
  headline: string;
  subheadline: string;
  keyBenefit: string;
  relevantStat: string;
  caseStudy?: {
    headline: string;
    company: string;
    outcome: string;
  };
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  capabilities: string[];
  cta: string;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export interface GeneratedOnePager {
  headline: string;
  company: string;
  industry: Industry;
  sections: {
    challenge: string;
    solution: string;
    benefits: string[];
    caseStudy?: {
      headline: string;
      company: string;
      outcome: string;
    };
    stats: Array<{ number: string; label: string }>;
    testimonial?: {
      quote: string;
      author: string;
      role: string;
    };
    cta: string;
  };
}

export interface GenerationRequest {
  company: string;
  notes: string;
  outputType: OutputType;
  emailTemplate?: EmailTemplate;
  industry?: Industry;
  persona?: Persona;
}

export interface GenerationResult {
  type: OutputType;
  email?: GeneratedEmail;
  onePager?: GeneratedOnePager;
  context: MeetingContext;
}
