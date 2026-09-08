import { cn } from "@/lib/utils";

/** Delicate line-based Arabic-inspired section divider. */
export function Divider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-4 py-2 text-primary/35", className)} aria-hidden>
      <span className="h-px w-full max-w-[220px] bg-gradient-to-l from-transparent to-current" />
      <svg width="86" height="18" viewBox="0 0 86 18" fill="none" className="shrink-0">
        <path
          d="M43 1.5 51 9l-8 7.5L35 9l8-7.5Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path d="M43 5.2 46.6 9 43 12.8 39.4 9 43 5.2Z" fill="currentColor" fillOpacity="0.5" />
        <path d="M22 9c4 0 6-4 9.5-4M64 9c-4 0-6-4-9.5-4M22 9c4 0 6 4 9.5 4M64 9c-4 0-6 4-9.5 4" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
        <circle cx="10" cy="9" r="1.6" fill="currentColor" />
        <circle cx="76" cy="9" r="1.6" fill="currentColor" />
      </svg>
      <span className="h-px w-full max-w-[220px] bg-gradient-to-r from-transparent to-current" />
    </div>
  );
}

/** Subtle ornamental corner brackets for cards and frames. */
export function CornerFrame({ className }: { className?: string }) {
  const corner = (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M25 1H9C4.6 1 1 4.6 1 9v16" stroke="currentColor" strokeWidth="1" />
      <circle cx="6" cy="6" r="1.3" fill="currentColor" />
    </svg>
  );
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-2 z-10 text-primary/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
        className,
      )}
      aria-hidden
    >
      <span className="absolute top-0 right-0 scale-x-[-1]">{corner}</span>
      <span className="absolute top-0 left-0">{corner}</span>
      <span className="absolute bottom-0 right-0 scale-[-1]">{corner}</span>
      <span className="absolute bottom-0 left-0 scale-y-[-1]">{corner}</span>
    </div>
  );
}
