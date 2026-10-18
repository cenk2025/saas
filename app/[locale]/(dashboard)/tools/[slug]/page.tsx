import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { ToolRunner } from "@/components/app/ToolRunner"
import { ToolIcon } from "@/components/ToolIcon"
import { getTool } from "@/lib/ai/tool-catalog"
import { Link } from "@/src/i18n/navigation"

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const tool = getTool(slug)
    if (!tool) notFound()

    const t = await getTranslations("Tools")
    const tw = await getTranslations("Workspace")
    const te = await getTranslations("Ecosystem")

    return (
        <div>
            <Link href="/tools" className="btn-ghost -ml-3 mb-4">
                <ArrowLeft className="h-4 w-4" /> {t("title")}
            </Link>
            <div className="mb-8 flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <ToolIcon slug={tool.slug} className="h-6 w-6" />
                </span>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t(`categories.${tool.category}`)}</p>
                    <h1 className="text-2xl font-bold sm:text-3xl">{t(`${tool.slug}.name`)}</h1>
                    <p className="mt-1 text-muted-foreground">{t(`${tool.slug}.description`)}</p>
                </div>
            </div>

            <ToolRunner tool={tool} />

            {tool.slug === "jobad" && (
                <a href="https://tyo.voon.fi" className="card mt-6 flex items-center justify-between gap-4 p-4 text-sm hover:border-primary/40">
                    <span><strong>tyo.voon.fi</strong> – {te("tyo")}</span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                </a>
            )}
            {tool.slug === "social" && (
                <a href="https://ads.voon.fi" className="card mt-6 flex items-center justify-between gap-4 p-4 text-sm hover:border-primary/40">
                    <span><strong>ads.voon.fi</strong> – {te("ads")}</span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                </a>
            )}
            <p className="mt-6 text-xs text-muted-foreground">{tw("aiDisclaimer")}</p>
        </div>
    )
}
