"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-morpeth-offwhite px-6 py-24 text-center text-morpeth-navy">
      <p className="font-heading text-xs uppercase tracking-[0.25em] text-morpeth-navy/70">Error</p>
      <h1 className="mt-3 font-heading text-2xl uppercase tracking-[0.15em] md:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-sm text-morpeth-navy/80">
        We hit an unexpected error loading this page. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex items-center rounded-full bg-morpeth-navy px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
