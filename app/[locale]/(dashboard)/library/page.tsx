import { getFormatter, getTranslations } from "next-intl/server"
import { FolderOpen } from "lucide-react"
import { PageHeader } from "@/components/app/PageHeader"
import { ToolIcon } from "@/components/ToolIcon"
import { getWorkspace, supabaseAdmin } from "@/lib/workspace"
import { Link } from "@/src/i18n/navigation"

export default async function LibraryPage() {
    const workspace = await getWorkspace()
    if (!workspace?.company) return null

    const t = await getTranslations("Library")
    const tt = await getTranslations("Tools")
    const format = await getFormatter()

    const { data: documents, error } = await supabaseAdmin()
        .from("ai_documents")
        .select("id, tool, title, output, created_at")
        .eq("company_id", workspace.company.id)
        .order("created_at", { ascending: false })
        .limit(100)

    return (
        <div>
            <PageHeader title={t("title")} subtitle={t("subtitle")} />

            {error && <p className="mb-6 rounded-xl bg-warning/10 p-3 text-sm text-warning">{t("setupHint")}</p>}

            {documents && documents.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {documents.map((doc) => (
                        <Link key={doc.id} href={`/library/${doc.id}`} className="card flex flex-col p-5 transition hover:border-primary/40 hover:shadow-md hover:shadow-black/5">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <ToolIcon slug={doc.tool} className="h-4 w-4 text-primary" />
                                {tt.has(`${doc.tool}.name`) ? tt(`${doc.tool}.name`) : doc.tool}
                            </div>
                            <h2 className="mt-3 line-clamp-2 font-semibold">{doc.title}</h2>
                            <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{doc.output.replace(/[#*_|>`-]/g, "").slice(0, 240)}</p>
                            <p className="mt-4 text-xs text-muted-foreground">
                                {format.dateTime(new Date(doc.created_at), { dateStyle: "medium" })}
                            </p>
                        </Link>
                    ))}
                </div>
            ) : (
                !error && (
                    <div className="card flex flex-col items-center gap-4 p-12 text-center">
                        <FolderOpen className="h-10 w-10 text-brand-gray" />
                        <p className="max-w-sm text-muted-foreground">{t("empty")}</p>
                        <Link href="/tools" className="btn-primary">{t("emptyCta")}</Link>
                    </div>
                )
            )}
        </div>
    )
}
