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
        <div className="md:hidden">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
            >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {open && (
                <div className="absolute inset-x-0 top-16 border-b border-border bg-background px-4 pb-6 pt-2 shadow-lg">
                    <nav className="flex flex-col">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href} onClick={close} className="border-b border-border py-3 font-medium">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-4 flex flex-col gap-2">
                        <Link href={primary.href} onClick={close} className="btn-primary">{primary.label}</Link>
                        {secondary && <Link href={secondary.href} onClick={close} className="btn-secondary">{secondary.label}</Link>}
                        <LanguageSwitcher className="mt-2 self-center" />
                    </div>
                </div>
            )}
        </div>
    )
}
