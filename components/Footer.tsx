import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { ECOSYSTEM } from "@/lib/ecosystem"
import { Link } from "@/src/i18n/navigation"

export default async function Footer() {
    const t = await getTranslations()
    const year = new Date().getFullYear()
    const linkClass = "inline-flex min-h-11 items-center text-[15px] text-muted-foreground transition hover:text-foreground"

    return (
        <footer className="bg-alt">
            <div className="container-wide grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div>
                    <Image src="/brand/voon-logo-color.png" alt="VOON IQ" width={1902} height={537} className="h-7 w-auto" />
                    <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-muted-foreground">{t("Footer.tagline")}</p>
                </div>

                <div>
                    <h3 className="text-[15px] font-semibold">{t("Footer.product")}</h3>
                    <ul className="mt-3">
                        <li><Link href="/#tools" className={linkClass}>{t("Navbar.tools")}</Link></li>
                        <li><Link href="/test" className={linkClass}>{t("App.health")}</Link></li>
                        <li><Link href="/#pricing" className={linkClass}>{t("Navbar.pricing")}</Link></li>
                        <li><Link href="/login" className={linkClass}>{t("Navbar.signIn")}</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-[15px] font-semibold">{t("Footer.ecosystem")}</h3>
                    <ul className="mt-3">
                        {ECOSYSTEM.map((service) => (
                            <li key={service.key}>
                                <a href={service.url} className={linkClass}>{new URL(service.url).host}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-[15px] font-semibold">{t("Footer.contact")}</h3>
                    <ul className="mt-3">
                        <li>
                            <a href="mailto:info@voon.fi" className={linkClass}>info@voon.fi</a>
                        </li>
                        <li className="flex min-h-11 items-center text-[15px] text-muted-foreground">{t("Footer.location")}</li>
                    </ul>
                </div>
            </div>
            <div className="container-wide py-6 text-[14px] text-muted-foreground">
                © {year} VOON IQ Oy. {t("Footer.rights")}
            </div>
        </footer>
    )
}
