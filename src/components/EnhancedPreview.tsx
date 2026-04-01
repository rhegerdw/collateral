'use client';

import { EnhancedOnePager } from '@/lib/collateral/types';

interface EnhancedPreviewProps {
  data: EnhancedOnePager;
}

export default function EnhancedPreview({ data }: EnhancedPreviewProps) {
  const { headline, subheadline, company, sections, stats, cta } = data;

  return (
    <article className="one-pager-preview text-gray-900 font-['Helvetica_Neue',Helvetica,Arial,sans-serif]">
      {/* Header */}
      <header className="border-b-4 border-black pb-6 mb-8">
        <div className="text-sm font-bold tracking-widest text-gray-500 mb-2">
          DARKWEBIQ
        </div>
        <h1 className="text-4xl font-black mb-3">{headline}</h1>
        <p className="text-lg text-gray-600 leading-tight mb-2">{subheadline}</p>
        <p className="text-sm text-gray-500">
          Prepared for <span className="font-bold text-gray-900">{company}</span>
        </p>
      </header>

      {/* Narrative Sections */}
      {sections.map((section, i) => (
        <section key={i} className="mb-8" style={{ breakInside: 'avoid' }}>
          <h2 className="text-lg font-bold mb-3 text-[#ff4400]">
            {section.heading}
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-3">
            {section.body.split('\n\n').map((paragraph, j) => (
              <p key={j}>{paragraph}</p>
            ))}
          </div>
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

      {/* Print button */}
      <div className="no-print mt-8 pt-8 border-t border-gray-200">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-6 py-3 font-bold text-sm tracking-[0.2em] uppercase hover:bg-[#ff4400] transition-colors"
        >
          Save as PDF
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Tip: In the print dialog, uncheck &ldquo;Headers and footers&rdquo; for a
          clean PDF.
        </p>
      </div>
    </article>
  );
}
