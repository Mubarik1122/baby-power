'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center bg-[#FFFCF9] text-[#3A3A3A]">
        <h2 className="text-2xl font-semibold">Something went wrong</h2>
        <p className="text-sm text-gray-600 max-w-md">
          {error.message || 'An unexpected error occurred while loading this page.'}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-2.5 bg-[#56C4C4] text-white text-sm rounded-lg hover:opacity-90"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
