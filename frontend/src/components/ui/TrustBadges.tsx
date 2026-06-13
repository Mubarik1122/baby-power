import { ShieldCheck, Globe, Package, Star } from 'lucide-react';

const badges = [
  { icon: ShieldCheck, label: 'OEKO-TEX Certified' },
  { icon: Globe, label: 'Ships Worldwide' },
  { icon: Package, label: 'Bulk MOQ Available' },
  { icon: Star, label: 'Trade Only Pricing' },
];

export default function TrustBadges() {
  return (
    <div className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center lg:justify-between gap-4 py-4">
          {badges.map((b) => (
            <div key={b.label} className="flex items-center gap-2 text-xs text-muted">
              <b.icon className="w-4 h-4 text-primary shrink-0" />
              <span className="uppercase tracking-widest">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
