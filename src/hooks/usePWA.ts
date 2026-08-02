import { useEffect, useState } from "react";

/** Registers the service worker and exposes the install prompt + offline state. */
export function usePWA() {
  const [deferred, setDeferred] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e);
    };
    const onInstalled = () => { setInstalled(true); setDeferred(null); };
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return { canInstall: !!deferred && !installed, install, offline };
}
