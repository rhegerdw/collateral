'use client';

import { useState } from 'react';
import { EnhancedOnePager, BrandViolation } from '@/lib/collateral/types';

interface EditablePreviewProps {
  data: EnhancedOnePager;
  onEdit: (instruction: string, sectionIndex?: number | null) => Promise<void>;
  editing: boolean;
  violations: BrandViolation[];
  editHistory: string[];
}

export default function EditablePreview({
  data,
  onEdit,
  editing,
  violations,
  editHistory,
}: EditablePreviewProps) {
  const { headline, subheadline, company, sections, stats, cta } = data;
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [instruction, setInstruction] = useState('');

  const handleSubmitEdit = async () => {
    if (!instruction.trim()) return;
    await onEdit(instruction.trim(), selectedSection);
    setInstruction('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitEdit();
    }
  };

  return (
    <div>
      {/* Document Preview */}
      <article className="one-pager-preview text-gray-900 font-['Helvetica_Neue',Helvetica,Arial,sans-serif]">
        {/* Header — click to edit whole doc */}
        <header
          className={`border-b-4 border-black pb-6 mb-8 cursor-pointer transition-colors ${
            selectedSection === null ? 'bg-orange-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => setSelectedSection(null)}
        >
          <div className="text-sm font-bold tracking-widest text-gray-500 mb-2">
            DARKWEBIQ
          </div>
          <h1 className="text-4xl font-black mb-3">{headline}</h1>
          <p className="text-lg text-gray-600 leading-tight mb-2">{subheadline}</p>
          <p className="text-sm text-gray-500">
            Prepared for <span className="font-bold text-gray-900">{company}</span>
          </p>
          {selectedSection === null && (
            <div className="mt-2 text-xs text-[#ff4400] font-bold tracking-wide">
              EDITING: WHOLE DOCUMENT
            </div>
          )}
        </header>

        {/* Narrative Sections — clickable */}
        {sections.map((section, i) => (
          <section
            key={i}
            className={`mb-8 p-3 -mx-3 cursor-pointer transition-colors border-l-4 ${
              selectedSection === i
                ? 'border-[#ff4400] bg-orange-50'
                : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
            }`}
            style={{ breakInside: 'avoid' }}
            onClick={() => setSelectedSection(i)}
          >
            <h2 className="text-lg font-bold mb-3 text-[#ff4400]">
              {section.heading}
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              {section.body.split('\n\n').map((paragraph, j) => (
                <p key={j}>{paragraph}</p>
              ))}
            </div>
            {selectedSection === i && (
              <div className="mt-2 text-xs text-[#ff4400] font-bold tracking-wide">
                EDITING THIS SECTION
              </div>
            )}
          </section>
        ))}

        {/* Stats */}
        {stats.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-3 text-[#ff4400]">By the Numbers</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              {stats.map((stat, i) => (
                <div key={i} className="bg-gray-100 p-4">
                  <div className="text-2xl font-black">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="border-t-2 border-black pt-6">
          <p className="font-bold text-sm">
            Next Step:{' '}
            <span className="text-gray-700 font-normal">{cta}</span>
          </p>
        </section>
      </article>

      {/* Edit Bar */}
      <div className="no-print mt-6 pt-6 border-t-2 border-black">
        <div className="flex gap-3">
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedSection !== null
                ? `Edit "${sections[selectedSection]?.heading}"... (e.g. "make this punchier")`
                : 'Edit the whole document... (e.g. "change the headline", "swap the stats")'
            }
            disabled={editing}
            className="flex-1 px-4 py-3 text-base border-2 border-black focus:outline-none focus:border-[#ff4400] disabled:opacity-50"
          />
          <button
            onClick={handleSubmitEdit}
            disabled={editing || !instruction.trim()}
            className="px-6 py-3 bg-[#ff4400] text-white font-bold text-sm tracking-[0.2em] uppercase hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editing ? 'Editing...' : 'Edit'}
          </button>
        </div>
        <div className="flex gap-4 mt-2">
          <p className="text-xs text-gray-500">
            {selectedSection !== null
              ? `Scope: Section "${sections[selectedSection]?.heading}" — click header to edit whole doc`
              : 'Scope: Whole document — click a section to scope edits'}
          </p>
        </div>
      </div>

      {/* Brand Violations */}
      {violations.length > 0 && (
        <div className="no-print mt-4 p-3 bg-yellow-50 border border-yellow-300 text-sm">
          <p className="font-bold text-yellow-800 mb-1">Auto-corrected brand violations:</p>
          <ul className="text-yellow-700 space-y-1">
            {violations.map((v, i) => (
              <li key={i}>
                <span className="line-through text-red-600">{v.original}</span>
                {' → '}
                <span className="text-green-700 font-medium">{v.corrected}</span>
                <span className="text-yellow-600 ml-2">({v.rule})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit History */}
      {editHistory.length > 0 && (
        <div className="no-print mt-4 p-3 bg-gray-50 border border-gray-200 text-sm">
          <p className="font-bold text-gray-600 mb-1 text-xs tracking-[0.2em] uppercase">
            Edit History
          </p>
          <ul className="text-gray-500 space-y-1">
            {editHistory.map((edit, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-gray-400">{i + 1}.</span>
                <span>{edit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Export buttons */}
      <div className="no-print mt-6 flex gap-3">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-6 py-3 font-bold text-sm tracking-[0.2em] uppercase hover:bg-[#ff4400] transition-colors"
        >
          Save as PDF
        </button>
        <button
          onClick={async () => {
            const res = await fetch('/api/export', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            if (!res.ok) return;
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = res.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1] || 'export.html';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="border-2 border-black text-black px-6 py-3 font-bold text-sm tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors"
        >
          Export HTML
        </button>
        <p className="self-center text-xs text-gray-500">
          Tip: For PDF, uncheck &ldquo;Headers and footers&rdquo; in print dialog.
        </p>
      </div>
    </div>
  );
}
