/**
 * Lightweight, zero-delay root loading indicator:
 * - A high-performance top progress bar
 * - Clean, non-blocking centered pulse ring matching the emerald design system
 * - Instant unmount the millisecond data resolves (no artificial timeouts or heavy skeleton shifts)
 */
export default function Loading() {
  return (
    <div className="relative min-h-[60vh] w-full" aria-busy="true" aria-live="polite">
      {/* Top glowing indeterminate progress line */}
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-line/20">
        <div className="h-full w-1/3 bg-accent animate-[indeterminate_1.2s_infinite_linear]" />
      </div>

      {/* Subtle modern centered pulse ring */}
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="relative flex items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-line border-t-accent" />
          <div className="absolute h-2 w-2 rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
