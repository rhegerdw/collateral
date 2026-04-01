'use client';

import { GeneratedOnePager } from '@/lib/collateral/types';

interface OnePagerPreviewProps {
  data: GeneratedOnePager;
}

export default function OnePagerPreview({ data }: OnePagerPreviewProps) {
  const { headline, company, sections } = data;

  // Parse challenge bullets from the string (they come as "• item\n• item")
  const challengeItems = sections.challenge
    .split('\n')
    .map((line) => line.replace(/^[•\-]\s*/, '').trim())
    .filter(Boolean);

  return (
    <article className="one-pager-preview text-gray-900 font-['Helvetica_Neue',Helvetica,Arial,sans-serif]">
      {/* Header */}
      <header className="border-b-4 border-black pb-6 mb-8">
        <div className="text-sm font-bold tracking-widest text-gray-500 mb-2">
          DARKWEBIQ
        </div>
        <h1 className="text-4xl font-black mb-3">{headline}</h1>
        <p className="text-base text-gray-500">
          Prepared for <span className="font-bold text-gray-900">{company}</span>
        </p>
      </header>

      {/* Challenge */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 text-[#ff4400]">The Challenge</h2>
        <ul className="text-gray-700 leading-relaxed space-y-1">
          {challengeItems.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </section>

      {/* Solution */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 text-[#ff4400]">
          The DarkWeb IQ Difference
        </h2>
        <p className="text-gray-700 mb-4">{sections.solution}</p>

        {/* Capabilities in two columns */}
        {sections.benefits.length > 0 && (
          <div>
            <h3 className="font-bold text-sm mb-2">Key Capabilities</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              {sections.benefits.map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 text-[#ff4400]">Results</h2>
        <div
          className={`grid gap-4 text-center ${
            sections.stats.length === 2
              ? 'grid-cols-2'
              : sections.stats.length >= 3
              ? 'grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          {sections.stats.map((stat, i) => (
            <div key={i} className="bg-gray-100 p-4">
              <div className="text-3xl font-black">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Study */}
      {sections.caseStudy && (
        <section className="mb-8" style={{ breakInside: 'avoid' }}>
          <h2 className="text-lg font-bold mb-3 text-[#ff4400]">
            Case Study: {sections.caseStudy.headline}
          </h2>
          <div className="border border-gray-200 p-4">
            <p className="font-bold text-sm mb-1">{sections.caseStudy.company}</p>
            <p className="text-gray-600 text-sm">{sections.caseStudy.outcome}</p>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {sections.testimonial && (
        <section
          className="border-t-2 border-black pt-6 mb-8"
          style={{ breakInside: 'avoid' }}
        >
          <blockquote className="text-gray-700 italic text-base leading-relaxed mb-3">
            &ldquo;{sections.testimonial.quote}&rdquo;
          </blockquote>
          <p className="text-sm">
            <span className="font-bold">{sections.testimonial.author}</span>
            <span className="text-[#ff4400]"> — {sections.testimonial.role}</span>
          </p>
        </section>
      )}

      {/* CTA */}
      <section className="border-t-2 border-black pt-6">
        <p className="font-bold text-sm">
          Next Step:{' '}
          <span className="text-gray-700 font-normal">{sections.cta}</span>
        </p>
      </section>

      {/* Print button - hidden in print */}
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
