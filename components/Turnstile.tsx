'use client';

import { useEffect, useRef, useState } from 'react';

// Cloudflare Turnstile: a privacy-friendly "are you human" check, usually passed without any clicks.
// The script is loaded only when the form comes near the viewport, so visitors who never reach
// the contact form never contact Cloudflare.

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
    const [visible, setVisible] = useState(false);
    // Keep the latest callback without re-rendering the widget when the parent re-renders.
    const onTokenRef = useRef(onToken);
    useEffect(() => {
        onTokenRef.current = onToken;
    }, [onToken]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '300px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!visible) return;
        const el = ref.current;
        let widgetId: string | null = null;
        let cancelled = false;

        loadScript()
            .then(() => {
                if (cancelled || !el || !window.turnstile) return;
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

        return () => {
            cancelled = true;
            onTokenRef.current(null);
            if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
        };
    }, [visible, siteKey, language, theme]);

    return <div ref={ref} className="flex min-h-[65px] justify-center" />;
}
