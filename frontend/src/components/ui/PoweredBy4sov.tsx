interface Props {
  href?: string;
}

export default function PoweredBy4sov({ href = 'https://4sov.com' }: Props) {
  const inner = (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-secondary/15 bg-surface/80 px-3 py-1.5 shadow-sm backdrop-blur-sm">
      <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
        Powered by
      </span>
      <span className="rounded-full bg-gradient-to-r from-primary-dark via-primary to-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-sm">
        4SOV
      </span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex transition-opacity hover:opacity-90"
        aria-label="Powered by 4SOV"
      >
        {inner}
      </a>
    );
  }

  return inner;
}
