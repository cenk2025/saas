'use client';

import { useTranslations } from 'next-intl';
import { useState, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'cookie-consent';

const noopSubscribe = () => () => {};
const readConsent = () => {
    try {
        return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
        return true; // Storage unavailable (private mode): don't nag
    }
};

export default function CookieConsent() {
    const t = useTranslations('Cookies');
    // Server render assumes consent so the banner only appears after hydration
    const stored = useSyncExternalStore(noopSubscribe, readConsent, () => true);
    const [accepted, setAccepted] = useState(false);

    if (stored || accepted) return null;

    const accept = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ necessary: true, timestamp: new Date().toISOString() }));
        } catch {
            // ignore
        }
        setAccepted(true);
    };

    return (
        <div className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl rounded-2xl border border-border bg-card p-4 shadow-xl sm:flex sm:items-center sm:gap-4">
            <p className="text-sm text-muted-foreground">{t('text')}</p>
            <button onClick={accept} className="btn-primary mt-3 w-full shrink-0 sm:mt-0 sm:w-auto">
                {t('ok')}
            </button>
        </div>
    );
}
