import { getTranslations } from "next-intl/server"
import { AppShell } from "@/components/app/AppShell"
import { getWorkspace } from "@/lib/workspace"
import { redirect } from "@/src/i18n/navigation"

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const workspace = await getWorkspace()

    if (!workspace) {
        return redirect({ href: "/login", locale })
    }

    const t = await getTranslations("App")

    return (
        <AppShell
            user={{
                name: workspace.user.name || workspace.user.email,
                email: workspace.user.email,
                role: t(`roles.${workspace.user.role}`),
                isAdmin: workspace.user.role === "ADMIN",
            }}
            companyName={workspace.company?.name}
        >
            {workspace.company ? (
                children
            ) : (
                <div className="card mx-auto mt-10 max-w-lg p-8 text-center text-muted-foreground">
                    {(await getTranslations("Workspace"))("noCompany")}
                </div>
            )}
        </AppShell>
    )
}
