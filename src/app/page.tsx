'use client';

import { useState } from 'react';
import {
  generateCollateral,
  onePagerToMarkdown,
  formatEmailForDisplay,
  GenerationResult,
  Industry,
  Persona,
  OutputType,
  EmailTemplate,
} from '@/lib/collateral';

const INDUSTRIES: { value: Industry | ''; label: string }[] = [
  { value: '', label: 'Auto-detect from notes' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'financial', label: 'Financial Services' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'smb', label: 'SMB' },
];

const PERSONAS: { value: Persona | ''; label: string }[] = [
  { value: '', label: 'Auto-detect from notes' },
  { value: 'ciso', label: 'CISO / Security Executive' },
  { value: 'cti', label: 'Threat Intelligence' },
  { value: 'soc', label: 'Security Operations' },
  { value: 'vendor-risk', label: 'Vendor Risk / TPRM' },
];

const OUTPUT_TYPES: { value: OutputType; label: string }[] = [
  { value: 'email', label: 'Follow-up Email' },
  { value: 'one-pager', label: 'One-Pager' },
];

const EMAIL_TYPES: { value: EmailTemplate; label: string }[] = [
  { value: 'post-meeting', label: 'Post-Meeting Follow-up' },
  { value: 'cold-outreach', label: 'Cold Outreach' },
  { value: 'threat-update', label: 'Industry Threat Update' },
  { value: 'event-follow-up', label: 'Event Follow-up' },
];

export default function GeneratePage() {
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [outputType, setOutputType] = useState<OutputType>('email');
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate>('post-meeting');
  const [industry, setIndustry] = useState<Industry | ''>('');
  const [persona, setPersona] = useState<Persona | ''>('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!company.trim()) {
      setError('Company name is required');
      return;
    }
    if (!notes.trim()) {
      setError('Meeting notes are required');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await generateCollateral(
        {
          company: company.trim(),
          notes: notes.trim(),
          outputType,
          emailTemplate: outputType === 'email' ? emailTemplate : undefined,
          industry: industry || undefined,
          persona: persona || undefined,
        },
        apiKey || undefined
      );
      setResult(res);
    } catch (err) {
      setError('Generation failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getOutputText = (): string => {
    if (!result) return '';
    if (result.type === 'email' && result.email) {
      return formatEmailForDisplay(result.email);
    }
    if (result.type === 'one-pager' && result.onePager) {
      return onePagerToMarkdown(result.onePager);
    }
    return '';
  };

  const handleCopy = async () => {
    const text = getOutputText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold tracking-tight">DARKWEBIQ</span>
            <span className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">Collateral Generator</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Input Panel */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Generate Collateral</h1>
            <p className="text-gray-600 mb-8">
              Transform meeting notes into tailored emails and one-pagers using your existing content.
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

              {/* Output Type & Email Template */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-600 mb-2">
                    Output Type
                  </label>
                  <select
                    value={outputType}
                    onChange={(e) => setOutputType(e.target.value as OutputType)}
                    className="w-full px-4 py-3 text-base border-2 border-black focus:outline-none focus:border-[#ff4400] bg-white"
                  >
                    {OUTPUT_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {outputType === 'email' && (
                  <div>
                    <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-600 mb-2">
                      Email Type
                    </label>
                    <select
                      value={emailTemplate}
                      onChange={(e) => setEmailTemplate(e.target.value as EmailTemplate)}
                      className="w-full px-4 py-3 text-base border-2 border-black focus:outline-none focus:border-[#ff4400] bg-white"
                    >
                      {EMAIL_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Industry & Persona */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-600 mb-2">
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value as Industry | '')}
                    className="w-full px-4 py-3 text-base border-2 border-black focus:outline-none focus:border-[#ff4400] bg-white"
                  >
                    {INDUSTRIES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-600 mb-2">
                    Persona
                  </label>
                  <select
                    value={persona}
                    onChange={(e) => setPersona(e.target.value as Persona | '')}
                    className="w-full px-4 py-3 text-base border-2 border-black focus:outline-none focus:border-[#ff4400] bg-white"
                  >
                    {PERSONAS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Meeting Notes */}
              <div>
                <label className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-600 mb-2">
                  Meeting Notes *
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paste your meeting notes here...

Example:
Met with Sarah Chen (CISO) and James Park (Head of CTI) at Acme Financial.
Discussed their concerns about ransomware targeting and vendor risk.
They currently use Recorded Future but find it noisy.
Interested in our access interception capability.
Next step: Send them a one-pager and schedule a demo for next week."
                  rows={10}
                  className="w-full px-4 py-3 text-base border-2 border-black focus:outline-none focus:border-[#ff4400] resize-none"
                />
              </div>

              {/* API Key (optional) */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-[#ff4400]"
                >
                  {showApiKey ? '▼' : '▶'} Advanced: API Key
                </button>
                {showApiKey && (
                  <div className="mt-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Anthropic API key for auto-detection"
                      className="w-full px-4 py-3 text-base border-2 border-gray-300 focus:outline-none focus:border-[#ff4400]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional. Enables AI-powered context extraction from notes.
                    </p>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-black text-white py-4 px-8 font-bold text-sm tracking-[0.2em] uppercase hover:bg-[#ff4400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
            </div>
          </div>

          {/* Output Panel */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Output</h2>
              {result && (
                <button
                  onClick={handleCopy}
                  className="bg-black text-white py-2 px-4 font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#ff4400] transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>

            <div className="border-2 border-black min-h-[500px] p-6 bg-gray-50">
              {!result && !loading && (
                <p className="text-gray-400 italic">
                  Generated collateral will appear here...
                </p>
              )}

              {loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse text-gray-500">Generating...</div>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  {/* Detected Context */}
                  {result.context && (
                    <div className="text-xs text-gray-500 border-b border-gray-200 pb-4">
                      <span className="font-bold uppercase tracking-[0.2em]">Detected: </span>
                      {result.context.industry && <span className="mr-3">Industry: {result.context.industry}</span>}
                      {result.context.persona && <span className="mr-3">Persona: {result.context.persona}</span>}
                      {result.context.attendees?.length ? (
                        <span>Attendees: {result.context.attendees.join(', ')}</span>
                      ) : null}
                    </div>
                  )}

                  {/* Output Content */}
                  <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {getOutputText()}
                  </div>
                </div>
              )}
            </div>

            {/* Token estimate */}
            {result && (
              <p className="text-xs text-gray-500 mt-2">
                Estimated tokens used: ~{Math.ceil(notes.length / 4) + 200} (extraction) + 0 (template fill)
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
