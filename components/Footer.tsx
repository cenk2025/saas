import { getTranslations } from "next-intl/server"
import { Mail, MapPin } from "lucide-react"
import Image from "next/image"
import { ECOSYSTEM } from "@/lib/ecosystem"
import { Link } from "@/src/i18n/navigation"

export default async function Footer() {
    const t = await getTranslations()
    const year = new Date().getFullYear()

    return (
        <footer className="bg-ink text-white/70">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div>
                    <Image src="/logo.png" alt="VOON IQ" width={1200} height={346} className="h-8 w-auto" />
                    <p className="mt-4 max-w-xs text-sm leading-relaxed">{t("Footer.tagline")}</p>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-white">{t("Footer.product")}</h3>
                    <ul className="mt-4 space-y-2.5 text-sm">
                        <li><Link href="/#tools" className="hover:text-white">{t("Navbar.tools")}</Link></li>
                        <li><Link href="/test" className="hover:text-white">{t("App.health")}</Link></li>
                        <li><Link href="/#pricing" className="hover:text-white">{t("Navbar.pricing")}</Link></li>
                        <li><Link href="/login" className="hover:text-white">{t("Navbar.signIn")}</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-white">{t("Footer.ecosystem")}</h3>
                    <ul className="mt-4 space-y-2.5 text-sm">
                        {ECOSYSTEM.map((service) => (
                            <li key={service.key}>
                                <a href={service.url} className="hover:text-white">{new URL(service.url).host}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-white">{t("Footer.contact")}</h3>
                    <ul className="mt-4 space-y-2.5 text-sm">
                        <li>
                            <a href="mailto:info@voon.fi" className="inline-flex items-center gap-2 hover:text-white">
                                <Mail className="h-4 w-4" /> info@voon.fi
                            </a>
                        </li>
                        <li className="inline-flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> {t("Footer.location")}
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-white/50 sm:px-6">
                    © {year} VOON IQ Oy. {t("Footer.rights")}
                </div>
            </div>
        </footer>
    )
}
