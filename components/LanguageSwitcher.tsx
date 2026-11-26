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
            className={`inline-flex items-center rounded-full bg-muted p-0.5 text-[13px] font-semibold ${isPending ? "opacity-60" : ""} ${className}`}
        >
            {routing.locales.map((l) => (
                <button
                    key={l}
                    type="button"
                    onClick={() => switchTo(l)}
                    aria-pressed={l === locale}
                    className={`min-h-11 min-w-11 rounded-full px-2 uppercase transition ${l === locale ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                    {l}
                </button>
            ))}
        </div>
    )
}
