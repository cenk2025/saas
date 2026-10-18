import { getFormatter, getTranslations } from "next-intl/server"
import { ArrowLeft } from "lucide-react"
import { DocumentActions } from "@/components/app/DocumentActions"
import { Markdown } from "@/components/Markdown"
import { ToolIcon } from "@/components/ToolIcon"
import { getWorkspace, supabaseAdmin } from "@/lib/workspace"
import { Link } from "@/src/i18n/navigation"

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const workspace = await getWorkspace()
    if (!workspace?.company) return null

    const t = await getTranslations("Library")
    const tt = await getTranslations("Tools")
    const format = await getFormatter()

    const { data: doc } = await supabaseAdmin()
        .from("ai_documents")
        .select("*")
        .eq("id", id)
        .eq("company_id", workspace.company.id)
        .maybeSingle()

    return (
        <div className="mx-auto max-w-3xl">
            <Link href="/library" className="btn-ghost -ml-3 mb-4">
                <ArrowLeft className="h-4 w-4" /> {t("title")}
            </Link>

            {!doc ? (
                <div className="card p-10 text-center text-muted-foreground">{t("notFound")}</div>
            ) : (
                <article className="card">
                    <header className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <ToolIcon slug={doc.tool} className="h-4 w-4 text-primary" />
                                {tt.has(`${doc.tool}.name`) ? tt(`${doc.tool}.name`) : doc.tool}
                                <span>·</span>
                                {t("createdBy", { date: format.dateTime(new Date(doc.created_at), { dateStyle: "medium", timeStyle: "short" }) })}
                            </p>
                            <h1 className="mt-2 text-xl font-bold">{doc.title}</h1>
                        </div>
                        <DocumentActions id={doc.id} text={doc.output} />
                    </header>
                    <div className="p-6 sm:p-8">
                        <Markdown>{doc.output}</Markdown>
                    </div>
                </article>
            )}
        </div>
    )
}
