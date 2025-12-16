import { Link } from "@/src/i18n/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserMenu } from "./UserMenu"
import { Role } from "@prisma/client"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { getTranslations } from "next-intl/server"

export async function Navbar() {
    const session = await getServerSession(authOptions)
    const t = await getTranslations("Navbar")

    return (
        <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                    Voon Business
                </Link>

                <div className="flex items-center gap-6">
                    <LanguageSwitcher />

                    {session?.user ? (
                        <>
                            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                                <Link href="/dashboard" className="text-foreground/80 hover:text-primary transition-colors">
                                    {t('dashboard')}
                                </Link>
                                <Link href="/advisor" className="text-foreground/80 hover:text-primary transition-colors">
                                    {t('advisor')}
                                </Link>
                                <Link href="/billing" className="text-foreground/80 hover:text-primary transition-colors">
                                    {t('billing')}
                                </Link>
                                {session.user.role === Role.ADMIN && (
                                    <Link href="/admin" className="text-foreground/80 hover:text-primary transition-colors">
                                        {t('admin')}
                                    </Link>
                                )}
                                <Link href="/test" className="text-foreground/80 hover:text-primary transition-colors">
                                    {t('diagnostic')}
                                </Link>
                            </nav>
                            <UserMenu user={session.user} />
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                        >
                            {t('signIn')}
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
