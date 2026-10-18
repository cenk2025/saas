"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useLocale, useTranslations } from "next-intl"
import {
    Activity, Building2, CreditCard, FolderOpen, Home, LogOut, Menu, MessageSquareText,
    Shield, Sparkles, X,
} from "lucide-react"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { Logo } from "@/components/Logo"
import { Link, usePathname } from "@/src/i18n/navigation"

interface ShellUser {
    name: string
    email: string
    role: string
    isAdmin: boolean
}

export function AppShell({ user, companyName, children }: {
    user: ShellUser
    companyName?: string
    children: React.ReactNode
}) {
    const t = useTranslations("App")
    const locale = useLocale()
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const nav = [
        { href: "/dashboard", label: t("home"), icon: Home },
        { href: "/tools", label: t("tools"), icon: Sparkles },
        { href: "/advisor", label: t("advisor"), icon: MessageSquareText },
        { href: "/test", label: t("health"), icon: Activity, match: ["/test", "/results"] },
        { href: "/library", label: t("library"), icon: FolderOpen },
    ]
    const secondary = [
        { href: "/company", label: t("company"), icon: Building2 },
        { href: "/billing", label: t("billing"), icon: CreditCard },
        ...(user.isAdmin ? [{ href: "/admin", label: t("admin"), icon: Shield }] : []),
    ]

    const isActive = (href: string, match?: string[]) =>
        (match ?? [href]).some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

    const renderLink = ({ href, label, icon: Icon, match }: { href: string; label: string; icon: typeof Home; match?: string[] }) => {
        const active = isActive(href, match)
        return (
            <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
                <Icon className={`h-[18px] w-[18px] ${active ? "text-primary" : ""}`} />
                {label}
            </Link>
        )
    }

    const initials = user.name.split(/[\s@]/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("")

    const sidebar = (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center px-5">
                <Link href="/dashboard" aria-label="Voon Business"><Logo className="h-6 w-auto" /></Link>
            </div>
            {companyName && (
                <div className="mx-3 mb-3 truncate rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground">
                    {companyName}
                </div>
            )}
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3">
                {nav.map(renderLink)}
                <div className="my-3 border-t border-border" />
                {secondary.map(renderLink)}
            </nav>
            <div className="space-y-3 border-t border-border p-3">
                <LanguageSwitcher />
                <div className="flex items-center gap-3 rounded-xl px-1">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">{initials}</span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.role}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: `/${locale}` })}
                        title={t("signOut")}
                        aria-label={t("signOut")}
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen lg:pl-64">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card lg:block">{sidebar}</aside>

            {/* Mobile top bar + drawer */}
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur lg:hidden">
                <Link href="/dashboard" aria-label="Voon Business"><Logo className="h-5 w-auto" /></Link>
                <button type="button" onClick={() => setOpen(true)} aria-label="Menu" className="rounded-lg p-2 hover:bg-muted">
                    <Menu className="h-5 w-5" />
                </button>
            </header>
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="absolute inset-0 bg-ink/40" />
                    <aside className="absolute inset-y-0 left-0 w-72 bg-card shadow-xl">
                        <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-4 rounded-lg p-2 hover:bg-muted">
                            <X className="h-5 w-5" />
                        </button>
                        {sidebar}
                    </aside>
                </div>
            )}

            <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</main>
        </div>
    )
}
