import { getServerSession } from "next-auth"
import { getTranslations } from "next-intl/server"
import { authOptions } from "@/lib/auth"
import { Link } from "@/src/i18n/navigation"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { Logo } from "./Logo"
import { MobileMenu } from "./MobileMenu"

export async function Navbar() {
    const session = await getServerSession(authOptions)
    const t = await getTranslations("Navbar")

    const links = [
        { href: "/#tools", label: t("tools") },
        { href: "/#how", label: t("features") },
        { href: "/#pricing", label: t("pricing") },
        { href: "/#contact", label: t("contact") },
    ]

    return (
        <header className="glass-nav sticky top-0 z-50">
            <div className="container-wide flex h-16 items-center justify-between gap-4">
                <Link href="/" aria-label="Voon Business" className="inline-flex min-h-11 shrink-0 items-center">
                    <Logo className="h-6 w-auto" />
                </Link>

                <nav className="hidden items-center gap-1 lg:flex">
                    {links.map((link) => (
                        <Link key={link.href} href={link.href} className="btn-ghost">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    {/* Wrapper: the switcher's own inline-flex would override `hidden`. */}
                    <div className="hidden xl:block">
                        <LanguageSwitcher />
                    </div>
                    {session?.user ? (
                        <Link href="/dashboard" className="btn-primary hidden sm:inline-flex">
                            {t("openApp")}
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="btn-ghost hidden sm:inline-flex">
                                {t("signIn")}
                            </Link>
                            <Link href="/register" className="btn-primary hidden sm:inline-flex">
                                {t("getStarted")}
                            </Link>
                        </>
                    )}
                    <MobileMenu
                        label={t("menu")}
                        links={links}
                        primary={session?.user ? { href: "/dashboard", label: t("openApp") } : { href: "/register", label: t("getStarted") }}
                        secondary={session?.user ? undefined : { href: "/login", label: t("signIn") }}
                    />
                </div>
            </div>
        </header>
    )
}
