import { getServerSession } from "next-auth"
import { getTranslations } from "next-intl/server"
import { ArrowRight } from "lucide-react"
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
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-lg">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                <Link href="/" aria-label="Voon Business" className="shrink-0">
                    <Logo />
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    {links.map((link) => (
                        <Link key={link.href} href={link.href} className="btn-ghost">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <LanguageSwitcher className="hidden sm:inline-flex" />
                    {session?.user ? (
                        <Link href="/dashboard" className="btn-primary hidden sm:inline-flex">
                            {t("openApp")} <ArrowRight className="h-4 w-4" />
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
