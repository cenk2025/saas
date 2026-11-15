import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { buildMetadata } from "@/lib/seo"
import { getWorkspace } from "@/lib/workspace"
import { DiagnosticTest } from "./DiagnosticTest"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "Diagnostic" })
    return buildMetadata({ locale, title: t("metaTitle"), description: t("subtitle"), path: "/test" })
}

// Public: anyone can take the health check. Signed-in users with a company get a saved report.
export default async function TestPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    setRequestLocale(locale)
    const workspace = await getWorkspace()

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
            <DiagnosticTest signedIn={Boolean(workspace?.company)} />
        </div>
    )
}
