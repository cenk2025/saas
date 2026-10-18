import { getTranslations } from "next-intl/server"
import { CompanyForm } from "@/components/app/CompanyForm"
import { PageHeader } from "@/components/app/PageHeader"
import { getWorkspace } from "@/lib/workspace"

export default async function CompanyPage() {
    const workspace = await getWorkspace()
    if (!workspace?.company) return null
    const t = await getTranslations("Company")
    const { company, user } = workspace

    return (
        <div className="mx-auto max-w-3xl">
            <PageHeader title={t("title")} subtitle={t("subtitle")} />
            <CompanyForm
                readOnly={user.role === "EMPLOYEE"}
                initial={{
                    name: company.name,
                    country: company.country ?? "",
                    profile: {
                        industry: company.profile?.industry ?? "",
                        size: company.profile?.size ?? "",
                        location: company.profile?.location ?? "",
                        website: company.profile?.website ?? "",
                        description: company.profile?.description ?? "",
                        customers: company.profile?.customers ?? "",
                        goals: company.profile?.goals ?? "",
                    },
                }}
            />
        </div>
    )
}
