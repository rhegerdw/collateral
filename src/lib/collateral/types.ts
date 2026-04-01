// Collateral Generator Types

export type Industry = 'healthcare' | 'financial' | 'enterprise' | 'smb';
export type Persona = 'ciso' | 'cti' | 'soc' | 'vendor-risk';
export type OutputType = 'email' | 'one-pager' | 'case-study' | 'datasheet' | 'report';
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

// Rich section for enhanced collateral — preserves narrative detail
export interface ContentSection {
  heading: string;
  body: string; // Markdown-ish: supports paragraphs, can be multi-line
}

// Chart types for report visualizations
export interface BarChart {
  type: 'bar-chart';
  title: string;
  afterSection: number;
  bars: Array<{ label: string; value: number; displayValue: string; style: 'primary' | 'dark' | 'muted' }>;
}

export interface TimelineChart {
  type: 'timeline';
  title: string;
  afterSection: number;
  items: Array<{ date: string; text: string; muted?: boolean }>;
}

export interface ComparisonChart {
  type: 'comparison';
  title: string;
  afterSection: number;
  boxes: Array<{
    title: string;
    items: Array<{ number: string; detail: string; highlight?: boolean }>;
    footnote?: string;
  }>;
}

export interface PipelineChart {
  type: 'pipeline';
  title: string;
  afterSection: number;
  stages: Array<{ label: string }>;
  footnotes?: Array<{ number: string; detail: string }>;
}

export type ReportChart = BarChart | TimelineChart | ComparisonChart | PipelineChart;

// Enhanced one-pager with flexible narrative sections
export interface EnhancedOnePager {
  headline: string;
  subheadline: string;
  company: string;
  industry: Industry;
  sections: ContentSection[];
  stats: Array<{ number: string; label: string }>;
  charts?: ReportChart[];
  cta: string;
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

// --- Enhance mode types ---

export interface EnhanceRequest {
  content: string;
  company: string;
  industry: Industry;
  persona: Persona;
  format: OutputType;
}

export interface EditRequest {
  instruction: string;
  currentDocument: EnhancedOnePager;
  sectionIndex?: number | null; // null or undefined = whole-document edit
}

export interface EditResponse {
  updatedDocument: EnhancedOnePager;
  changeDescription: string;
  violations: BrandViolation[];
}

export interface BrandViolation {
  field: string;
  original: string;
  corrected: string;
  rule: string;
}
