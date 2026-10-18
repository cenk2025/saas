import { getTranslations } from "next-intl/server"
import { ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/app/PageHeader"
import { ToolIcon } from "@/components/ToolIcon"
import { TOOL_CATEGORIES, TOOLS } from "@/lib/ai/tool-catalog"
import { Link } from "@/src/i18n/navigation"

export default async function ToolsPage() {
    const t = await getTranslations("Tools")

    return (
        <div>
            <PageHeader title={t("title")} subtitle={t("subtitle")} />
            <div className="space-y-10">
                {TOOL_CATEGORIES.map((category) => (
                    <section key={category}>
                        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {t(`categories.${category}`)}
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {TOOLS.filter((tool) => tool.category === category).map((tool) => (
                                <Link
                                    key={tool.slug}
                                    href={`/tools/${tool.slug}`}
                                    className="card group flex items-start gap-4 p-5 transition hover:border-primary/40 hover:shadow-md hover:shadow-black/5"
                                >
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                                        <ToolIcon slug={tool.slug} className="h-5 w-5" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-semibold">{t(`${tool.slug}.name`)}</span>
                                        <span className="mt-1 block text-sm text-muted-foreground">{t(`${tool.slug}.description`)}</span>
                                    </span>
                                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    )
}
