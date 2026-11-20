"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { CONSENT_KEY } from "@/lib/constants";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

declare global {
  interface Window {
    gtag?: (
      command: "consent" | "config" | "event",
      action: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (!saved) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (choice: CookiePreferences) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(choice));

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: choice.analytics ? "granted" : "denied",
        ad_storage: choice.marketing ? "granted" : "denied",
      });
    }

    setShow(false);
  };

  const acceptAll = () => {
    const allIn = { necessary: true, analytics: true, marketing: true };
    setPreferences(allIn);
    saveConsent(allIn);
  };

  const acceptNecessaryOnly = () => {
    const essentialOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(essentialOnly);
    saveConsent(essentialOnly);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 z-50 w-full max-w-md p-4 animate-in fade-in slide-in-from-bottom-5 duration-200 max-sm:bottom-0 max-sm:left-0 max-sm:max-w-none max-sm:p-2"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="rounded-lg border border-line bg-paper p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Cookie size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-ink">
              We value your privacy
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              We use necessary cookies for site security and cart functions.
              With your consent, we also use analytics cookies to improve our
              medical supply services in Kenya. Learn more in our{" "}
              <Link
                href="/privacy"
                className="font-medium text-brand underline hover:text-brand-accent"
              >
                Privacy Policy
              </Link>
              .
            </p>

            {showPreferences && (
              <div className="mt-3 flex flex-col gap-2 rounded bg-soft p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">
                    Essential (Cart & Security)
                  </span>
                  <span className="font-medium text-brand">Always Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">
                    Analytics & Usage
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences((p) => ({
                        ...p,
                        analytics: e.target.checked,
                      }))
                    }
                    className="size-4 rounded border-line text-brand focus:ring-brand"
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={acceptAll}
                className="flex-1 rounded bg-brand px-3.5 py-2 text-xs font-semibold text-paper shadow-sm transition-colors hover:bg-brand-accent"
              >
                Accept All
              </button>

              {showPreferences ? (
                <button
                  type="button"
                  onClick={() => saveConsent(preferences)}
                  className="rounded border border-line bg-paper px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-soft"
                >
                  Save Choices
                </button>
              ) : (
                <button
                  type="button"
                  onClick={acceptNecessaryOnly}
                  className="rounded border border-line bg-paper px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-soft"
                >
                  Essential Only
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowPreferences((v) => !v)}
                className="text-xs font-medium text-muted underline transition-colors hover:text-ink"
              >
                {showPreferences ? "Hide Options" : "Customize"}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={acceptNecessaryOnly}
            aria-label="Close cookie banner"
            className="text-muted transition-colors hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
