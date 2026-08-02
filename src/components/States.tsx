import { FiAlertTriangle, FiRefreshCw, FiWind } from "react-icons/fi";

export function LoadingSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3" aria-busy="true" aria-label="Loading forecast">
      <div className="space-y-5 lg:col-span-2">
        <div className="skeleton h-64 rounded-3xl" />
        <div className="skeleton h-72 rounded-3xl" />
        <div className="skeleton h-64 rounded-3xl" />
      </div>
      <div className="space-y-5">
        <div className="skeleton h-80 rounded-3xl" />
        <div className="skeleton h-52 rounded-3xl" />
        <div className="skeleton h-40 rounded-3xl" />
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-white/20 bg-white/10 p-10 text-center backdrop-blur-xl" role="alert">
      <FiAlertTriangle className="mb-3 text-4xl text-amber-300" />
      <h2 className="font-display text-xl font-semibold">Something went wrong</h2>
      <p className="mt-1 text-sm opacity-80">{message}</p>
      <button onClick={onRetry} className="mt-5 flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:scale-105">
        <FiRefreshCw /> Try again
      </button>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-white/20 bg-white/10 p-10 text-center backdrop-blur-xl">
      <FiWind className="mb-3 text-4xl opacity-70" />
      <h2 className="font-display text-xl font-semibold">No city selected</h2>
      <p className="mt-1 text-sm opacity-80">Search for a city or use your location to see the forecast.</p>
    </div>
  );
}
