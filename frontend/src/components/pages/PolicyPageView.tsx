import PageBanner from '@/components/ui/PageBanner';

interface Props {
  title: string;
  content: string | null;
  fallback?: string;
}

export default function PolicyPageView({ title, content, fallback }: Props) {
  return (
    <div>
      <PageBanner title={title} />
      <section className="py-14 lg:py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4">
          {content ? (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p className="text-muted text-sm">{fallback || 'Content will be available soon.'}</p>
          )}
        </div>
      </section>
    </div>
  );
}
