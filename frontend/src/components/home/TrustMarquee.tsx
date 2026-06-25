const items = [
  'Outstanding Service',
  'Exclusive Pricing',
  'Industry Expertise',
  'OEKO-TEX Certified',
  'UK & NI Shipping',
  'Low MOQ Available',
];

export default function TrustMarquee() {
  const doubled = [...items, ...items];

  return (
    <section className="bg-primary text-white py-3 overflow-hidden border-b border-primary-dark/30">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center mx-8 text-[11px] uppercase tracking-[0.25em] font-medium">
            <span className="text-gold mr-4">✦</span>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
