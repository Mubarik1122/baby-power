export default function ApiUnavailable() {
  return (
    <div className="bg-blush border-b border-border px-4 py-3 text-center text-sm text-secondary">
      <p>
        We&apos;re having trouble loading catalogue data. Please ensure the API is running — run{' '}
        <code className="text-xs bg-surface px-1.5 py-0.5 border border-border">npm run dev</code>{' '}
        from the project root.
      </p>
    </div>
  );
}
