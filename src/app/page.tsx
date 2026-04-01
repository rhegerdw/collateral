'use client';

import { useState, useRef } from 'react';
import { EnhancedOnePager, BrandViolation, Industry, Persona, OutputType } from '@/lib/collateral/types';
import { extractFileToMarkdown, ACCEPTED_FILE_TYPES, isSupportedFile, ExtractedSource, mergeExtractedSources } from '@/lib/file-extract';
import EditablePreview from '@/components/EditablePreview';

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'financial', label: 'Financial Services' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'smb', label: 'SMB' },
];

const PERSONAS: { value: Persona; label: string }[] = [
  { value: 'ciso', label: 'CISO / Security Executive' },
  { value: 'cti', label: 'Threat Intelligence' },
  { value: 'soc', label: 'Security Operations' },
  { value: 'vendor-risk', label: 'Vendor Risk / TPRM' },
];

const OUTPUT_TYPES: { value: OutputType; label: string; description: string }[] = [
  { value: 'report', label: 'Report', description: 'Polished intelligence report' },
  { value: 'case-study', label: 'Case Study', description: 'Rich narrative with full detail' },
  { value: 'one-pager', label: 'One-Pager', description: 'Scannable overview' },
  { value: 'datasheet', label: 'Datasheet', description: 'Technical reference document' },
  { value: 'email', label: 'Email', description: 'Concise outreach email' },
];

export default function GeneratePage() {
  // Input state
  const [company, setCompany] = useState('');
  const [outputType, setOutputType] = useState<OutputType>('case-study');
  const [industry, setIndustry] = useState<Industry | ''>('');
  const [persona, setPersona] = useState<Persona | ''>('');
  const [pastedText, setPastedText] = useState('');
  const [sources, setSources] = useState<ExtractedSource[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [extracting, setExtracting] = useState(false);

  // Output state
  const [document, setDocument] = useState<EnhancedOnePager | null>(null);
  const [violations, setViolations] = useState<BrandViolation[]>([]);
  const [editHistory, setEditHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setExtracting(true);
    setError('');

    try {
      const newSources: ExtractedSource[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!isSupportedFile(file.name)) {
          setError(`Skipped ${file.name} — only .pptx, .pdf, .docx supported`);
          continue;
        }
        const content = await extractFileToMarkdown(file);
        newSources.push({ filename: file.name, content });
      }
      setSources((prev) => [...prev, ...newSources]);
    } catch (err) {
      setError('Failed to extract content from one or more files.');
      console.error(err);
    } finally {
      setExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeSource = (index: number) => {
    setSources((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!company.trim()) {
      setError('Company name is required');
      return;
    }
    if (!industry) {
      setError('Please select an industry');
      return;
    }
    if (!persona) {
      setError('Please select a persona');
      return;
    }

    // Build merged content from all sources
    const allSources = [...sources];
    if (pastedText.trim()) {
      allSources.push({ filename: 'Pasted text', content: pastedText.trim() });
    }

    if (allSources.length === 0) {
      setError('Please upload files or paste content');
      return;
    }

    const mergedContent = mergeExtractedSources(allSources);

    setLoading(true);
    setError('');
    setDocument(null);
    setViolations([]);
    setEditHistory([]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: mergedContent,
          company: company.trim(),
          industry,
          persona,
          format: outputType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Generation failed');
      }

      const data = await res.json();
      setDocument(data.document);
      setViolations(data.violations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (instruction: string, sectionIndex?: number | null) => {
    if (!document) return;

    setEditing(true);
    setError('');

    try {
      const res = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction,
          currentDocument: document,
          sectionIndex,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Edit failed');
      }

      const data = await res.json();
      setDocument(data.updatedDocument);
      setViolations(data.violations || []);
      setEditHistory((prev) => [...prev, instruction]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Edit failed');
      console.error(err);
    } finally {
      setEditing(false);
    }
  };

  const totalSources = sources.length + (pastedText.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold tracking-tight">DARKWEBIQ</span>
            <span className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
              Collateral Generator
            </span>
          </div>
          {document && (
            <button
              onClick={() => {
                setDocument(null);
                setViolations([]);
                setEditHistory([]);
              }}
              className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-[#ff4400]"
            >
              New Document
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!document && !loading ? (
          /* ── Input Form ── */
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Generate Collateral</h1>
            <p className="text-gray-600 mb-8">
              Upload source materials, set parameters, and generate branded collateral.
              You can upload multiple files and paste text — everything gets synthesized.
            </p>

            <div className="space-y-6">
              {/* Company */}
              <div>
                <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-600 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full px-4 py-3 text-base border-2 border-black focus:outline-none focus:border-[#ff4400]"
                />
              </div>

              {/* Output Type */}
              <div>
                <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-600 mb-2">
                  Output Format *
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {OUTPUT_TYPES.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setOutputType(opt.value)}
                      className={`py-3 px-4 border-2 font-bold text-sm transition-colors text-left ${
                        outputType === opt.value
                          ? 'border-[#ff4400] bg-[#ff4400] text-white'
                          : 'border-black text-gray-600 hover:text-black'
                      }`}
                    >
                      <div className="tracking-[0.1em] uppercase">{opt.label}</div>
                      <div className="text-xs font-normal mt-1 opacity-75">{opt.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry & Persona */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-600 mb-2">
                    Industry *
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value as Industry | '')}
                    className="w-full px-4 py-3 text-base border-2 border-black focus:outline-none focus:border-[#ff4400] bg-white"
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-600 mb-2">
                    Persona *
                  </label>
                  <select
                    value={persona}
                    onChange={(e) => setPersona(e.target.value as Persona | '')}
                    className="w-full px-4 py-3 text-base border-2 border-black focus:outline-none focus:border-[#ff4400] bg-white"
                  >
                    <option value="">Select persona</option>
                    {PERSONAS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Source Materials */}
              <div>
                <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-600 mb-2">
                  Source Materials *
                </label>

                {/* File upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ACCEPTED_FILE_TYPES}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={extracting}
                  className="border-2 border-dashed border-gray-400 hover:border-black w-full py-6 px-4 text-sm text-gray-500 hover:text-black transition-colors disabled:opacity-50 mb-3"
                >
                  {extracting
                    ? 'Extracting content...'
                    : 'Drop or click to upload .pptx, .pdf, .docx files (multiple allowed)'}
                </button>

                {/* Uploaded sources list */}
                {sources.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {sources.map((source, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#ff4400]">
                            {source.filename.split('.').pop()?.toUpperCase()}
                          </span>
                          <span className="text-sm">{source.filename}</span>
                          <span className="text-xs text-gray-400">
                            ({Math.round(source.content.length / 1000)}k chars)
                          </span>
                        </div>
                        <button
                          onClick={() => removeSource(i)}
                          className="text-gray-400 hover:text-red-600 text-sm font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Paste text */}
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste additional text here — meeting notes, raw copy, report excerpts, anything relevant..."
                  rows={6}
                  className="w-full px-4 py-3 text-base border-2 border-black focus:outline-none focus:border-[#ff4400] resize-none"
                />

                {totalSources > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {totalSources} source{totalSources !== 1 ? 's' : ''} — all will be synthesized into one document
                  </p>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-[#ff4400] hover:bg-black text-white py-4 px-8 font-bold text-sm tracking-[0.2em] uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>

              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
          </div>
        ) : loading ? (
          /* ── Loading ── */
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-pulse text-gray-500 text-lg mb-2">
                Generating your {outputType.replace('-', ' ')}...
              </div>
              <p className="text-xs text-gray-400">
                Synthesizing {totalSources} source{totalSources !== 1 ? 's' : ''} with brand rules applied
              </p>
            </div>
          </div>
        ) : document ? (
          /* ── Output with Editable Preview ── */
          <div className="max-w-4xl mx-auto">
            <EditablePreview
              data={document}
              onEdit={handleEdit}
              editing={editing}
              violations={violations}
              editHistory={editHistory}
            />
            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
          </div>
        ) : null}
      </main>
    </div>
  );
}
