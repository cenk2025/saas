"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Link } from "@/src/i18n/navigation"
import { LanguageSwitcher } from "./LanguageSwitcher"

type NavLink = { href: string; label: string }

export function MobileMenu({ label, links, primary, secondary }: {
    label: string
    links: NavLink[]
    primary: NavLink
    secondary?: NavLink
}) {
    const [open, setOpen] = useState(false)
    const close = () => setOpen(false)

    return (
        <div className="lg:hidden">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-black/5"
            >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {open && (
                <div className="absolute inset-x-0 top-16 h-[calc(100dvh-4rem)] overflow-y-auto bg-background px-6 pb-10 pt-4">
                    <nav className="flex flex-col">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={close}
                                className="flex min-h-14 items-center text-[28px] font-semibold tracking-[-0.02em]"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-8 flex flex-col gap-3">
                        <Link href={primary.href} onClick={close} className="btn-primary">{primary.label}</Link>
                        {secondary && <Link href={secondary.href} onClick={close} className="btn-secondary">{secondary.label}</Link>}
                        <LanguageSwitcher className="mt-4 self-center" />
                    </div>
                </div>
            )}
        </div>
    )
}
