import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

/** App-wide error boundary to catch render failures gracefully. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error("Skyward error boundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-8 text-center text-white">
          <span className="text-5xl">🌩️</span>
          <h1 className="mt-4 font-display text-2xl font-semibold">Something broke</h1>
          <p className="mt-1 text-sm opacity-70">Please reload the page to try again.</p>
          <button onClick={() => location.reload()} className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900">
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
