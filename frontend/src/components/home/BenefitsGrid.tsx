import { Shield, Truck, Award, Users, Sparkles, MapPin } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const benefits = [
  { icon: Shield, title: 'OEKO-TEX Certified', desc: 'Safe, tested fabrics for every baby garment we manufacture.' },
  { icon: Truck, title: 'UK & NI Delivery', desc: 'Reliable wholesale delivery across the United Kingdom and Northern Ireland.' },
  { icon: Award, title: 'Trade Pricing', desc: 'Factory-direct wholesale rates with flexible MOQs.' },
  { icon: Users, title: 'Account Support', desc: 'Dedicated trade managers for every retail partner.' },
  { icon: Sparkles, title: 'Seasonal Drops', desc: 'Fresh collections every season — rompers, sets & gift boxes.' },
  { icon: MapPin, title: 'UK Based', desc: 'Trusted wholesale partner with UK-based account management.' },
];

export default function BenefitsGrid() {
  return (
    <section className="py-14 lg:py-20 bg-linen border-t border-border relative grain">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-3">Why Baby Power</p>
          <h2 className="font-display text-3xl lg:text-4xl text-secondary tracking-wide">Wholesale Benefits</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <div className="bg-surface border border-border p-6 lg:p-7 hover:border-primary/40 hover:shadow-md transition-all h-full">
                <b.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-lg text-secondary mb-2">{b.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
