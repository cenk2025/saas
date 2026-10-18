"use client"

import { useLocale } from "next-intl"
import { useTransition } from "react"
import { routing, usePathname, useRouter } from "@/src/i18n/navigation"

export function LanguageSwitcher({ className = "" }: { className?: string }) {
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const switchTo = (next: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: next })
        })
    }

    return (
        <div
            role="group"
            aria-label="Language"
            className={`inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-semibold ${isPending ? "opacity-60" : ""} ${className}`}
        >
            {routing.locales.map((l) => (
                <button
                    key={l}
                    type="button"
                    onClick={() => switchTo(l)}
                    aria-pressed={l === locale}
                    className={`rounded-full px-2.5 py-1 uppercase transition ${l === locale ? "bg-ink text-white" : "text-muted-foreground hover:text-foreground"}`}
                >
                    {l}
                </button>
            ))}
        </div>
    )
}
