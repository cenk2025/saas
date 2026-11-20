'use client';

import { useEffect, useRef } from 'react';

// Cloudflare Turnstile: a privacy-friendly "are you human" check, usually passed without any clicks.
// The widget is loaded only once the visitor starts filling in the form (first focus or click
// inside it), so visitors who only read the page never contact Cloudflare and no tokens are
// issued that would never be sent to the server for verification.

type TurnstileOptions = {
    sitekey: string;
    language?: string;
    theme?: 'light' | 'dark' | 'auto';
    callback?: (token: string) => void;
    'expired-callback'?: () => void;
    'error-callback'?: () => void;
};

declare global {
    interface Window {
        turnstile?: {
            render: (el: HTMLElement, options: TurnstileOptions) => string;
            remove: (widgetId: string) => void;
        };
    }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptPromise: Promise<void> | null = null;
// Forms the visitor has already used: a remounted widget (after a send attempt) renders at once.
const activeForms = new WeakSet<HTMLFormElement>();

function loadScript(): Promise<void> {
    if (window.turnstile) return Promise.resolve();
    if (!scriptPromise) {
        scriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = SCRIPT_SRC;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => {
                scriptPromise = null; // allow a retry on the next mount
                reject(new Error('Turnstile script failed to load'));
            };
            document.head.appendChild(script);
        });
    }
    return scriptPromise;
}

type Props = {
    siteKey: string;
    language: string;
    theme: 'light' | 'dark';
    onToken: (token: string | null) => void;
};

export function Turnstile({ siteKey, language, theme, onToken }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    // Keep the latest callback without re-rendering the widget when the parent re-renders.
    const onTokenRef = useRef(onToken);
    useEffect(() => {
        onTokenRef.current = onToken;
    }, [onToken]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let widgetId: string | null = null;
        let cancelled = false;
        let started = false;

        // A click fires both pointerdown and focusin: render only once.
        const begin = () => {
            if (started) return;
            started = true;
            if (form) activeForms.add(form);
            loadScript()
                .then(() => {
                    if (cancelled || !window.turnstile) return;
                    widgetId = window.turnstile.render(el, {
                        sitekey: siteKey,
                        language,
                        theme,
                        callback: (token) => onTokenRef.current(token),
                        'expired-callback': () => onTokenRef.current(null),
                        'error-callback': () => onTokenRef.current(null),
                    });
                })
                .catch((error) => console.error(error));
        };

        const form = el.closest('form');
        if (!form || activeForms.has(form)) {
            begin();
        } else {
            form.addEventListener('focusin', begin, { once: true });
            form.addEventListener('pointerdown', begin, { once: true });
        }

        return () => {
            cancelled = true;
            form?.removeEventListener('focusin', begin);
            form?.removeEventListener('pointerdown', begin);
            onTokenRef.current(null);
            if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
        };
    }, [siteKey, language, theme]);

    return <div ref={ref} className="flex min-h-[65px] justify-center" />;
}
