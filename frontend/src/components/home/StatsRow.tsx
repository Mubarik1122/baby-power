import Reveal from '@/components/ui/Reveal';

const stats = [
  { value: '15+', label: 'Years of Excellence' },
  { value: '500+', label: 'Product Styles' },
  { value: '1000+', label: 'Trade Partners' },
];

export default function StatsRow() {
  return (
    <section className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 divide-x divide-border">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={(i + 1) as 1 | 2 | 3 | 4}>
              <div className="py-10 lg:py-12 text-center px-4">
                <p className="font-display text-4xl lg:text-5xl text-primary tracking-wide">{stat.value}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted font-medium">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
