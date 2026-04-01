// Client-side file-to-markdown extractor
// Supports: .pptx, .pdf, .docx

import JSZip from 'jszip';

// ── Public API ──────────────────────────────────────────────

const SUPPORTED_EXTENSIONS = ['.pptx', '.pdf', '.docx'];

export function isSupportedFile(filename: string): boolean {
  return SUPPORTED_EXTENSIONS.some((ext) =>
    filename.toLowerCase().endsWith(ext)
  );
}

export const ACCEPTED_FILE_TYPES = '.pptx,.pdf,.docx';

export interface ExtractedSource {
  filename: string;
  content: string;
}

export function mergeExtractedSources(sources: ExtractedSource[]): string {
  if (sources.length === 0) return '';
  if (sources.length === 1) return sources[0].content;

  return sources
    .map((s) => `--- Source: ${s.filename} ---\n${s.content}`)
    .join('\n\n');
}

export async function extractFileToMarkdown(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith('.pptx')) {
    return extractPptx(file);
  }
  if (name.endsWith('.pdf')) {
    return extractPdf(file);
  }
  if (name.endsWith('.docx')) {
    return extractDocx(file);
  }

  throw new Error(
    `Unsupported file type. Please upload a ${SUPPORTED_EXTENSIONS.join(', ')} file.`
  );
}

// ── PPTX Extraction ─────────────────────────────────────────

interface SlideContent {
  slideNumber: number;
  texts: string[];
}

function parseSlideXml(xml: string): string[] {
  const paragraphs: string[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');

  const pNodes = doc.getElementsByTagName('a:p');
  for (let i = 0; i < pNodes.length; i++) {
    const tNodes = pNodes[i].getElementsByTagName('a:t');
    let text = '';
    for (let j = 0; j < tNodes.length; j++) {
      text += tNodes[j].textContent || '';
    }
    const trimmed = text.trim();
    if (trimmed) paragraphs.push(trimmed);
  }

  return paragraphs;
}

async function extractPptx(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);

  const slideEntries: { num: number; path: string }[] = [];
  zip.forEach((path) => {
    const match = path.match(/^ppt\/slides\/slide(\d+)\.xml$/);
    if (match) {
      slideEntries.push({ num: parseInt(match[1], 10), path });
    }
  });
  slideEntries.sort((a, b) => a.num - b.num);

  if (slideEntries.length === 0) {
    throw new Error('No slides found. Make sure this is a valid .pptx file.');
  }

  const slides: SlideContent[] = [];
  for (const entry of slideEntries) {
    const xmlContent = await zip.file(entry.path)?.async('string');
    if (!xmlContent) continue;
    const texts = parseSlideXml(xmlContent);
    if (texts.length > 0) {
      slides.push({ slideNumber: entry.num, texts });
    }
  }

  const header = `# ${file.name.replace(/\.pptx$/i, '')}`;
  const body = slides
    .map((slide) => {
      const lines = [`## Slide ${slide.slideNumber}`];
      slide.texts.forEach((text, i) => {
        if (i === 0 && text.length < 100) {
          lines.push(`**${text}**`);
        } else {
          lines.push(`- ${text}`);
        }
      });
      return lines.join('\n');
    })
    .join('\n\n');

  return `${header}\n\n${body}`;
}

// ── PDF Extraction ──────────────────────────────────────────

async function extractPdf(file: File): Promise<string> {
  // Dynamic import to avoid SSR issues — pdf.js is browser-only
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  const header = `# ${file.name.replace(/\.pdf$/i, '')}`;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    // Group text items into lines by Y position
    const lines = new Map<number, string[]>();
    for (const item of content.items) {
      if (!('str' in item) || !item.str.trim()) continue;
      // Round Y to group items on the same line
      const y = Math.round(item.transform[5]);
      if (!lines.has(y)) lines.set(y, []);
      lines.get(y)!.push(item.str);
    }

    // Sort by Y descending (PDF coordinates start from bottom)
    const sortedLines = Array.from(lines.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([, texts]) => texts.join(' ').trim())
      .filter(Boolean);

    if (sortedLines.length > 0) {
      const pageLines = [`## Page ${i}`];
      sortedLines.forEach((line, idx) => {
        // First line of page is likely a heading if short
        if (idx === 0 && line.length < 100) {
          pageLines.push(`**${line}**`);
        } else {
          pageLines.push(line);
        }
      });
      pages.push(pageLines.join('\n'));
    }
  }

  return `${header}\n\n${pages.join('\n\n')}`;
}

// ── DOCX Extraction ─────────────────────────────────────────

async function extractDocx(file: File): Promise<string> {
  // Dynamic import to avoid SSR issues
  const mammoth = await import('mammoth');

  const buffer = await file.arrayBuffer();
  // convertToHtml preserves structure better than extractRawText
  const result = await mammoth.convertToHtml({ arrayBuffer: buffer });

  // Convert simple HTML to markdown-ish text
  const html = result.value;
  const text = html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '## $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '### $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '#### $1\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '') // strip remaining HTML tags
    .replace(/\n{3,}/g, '\n\n') // collapse excessive newlines
    .trim();

  const header = `# ${file.name.replace(/\.docx$/i, '')}`;
  return `${header}\n\n${text}`;
}
