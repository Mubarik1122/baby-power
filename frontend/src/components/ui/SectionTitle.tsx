interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  label?: string;
}

export default function SectionTitle({ title, subtitle, centered = true, label }: SectionTitleProps) {
  return (
    <div className={centered ? 'text-center mb-12 lg:mb-16' : 'mb-12 lg:mb-16'}>
      {label && (
        <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-4">{label}</p>
      )}
      <div className={`ornament-divider max-w-xs ${centered ? 'mx-auto' : ''} mb-6`}>
        <span className="text-gold text-xs shrink-0">✦</span>
      </div>
      <h2 className="font-display text-3xl lg:text-[2.75rem] text-secondary tracking-wide leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted text-sm max-w-md mx-auto leading-relaxed font-light italic">
          {subtitle}
        </p>
      )}
    </div>
  );
}
