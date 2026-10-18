import {
    FileSearch, FileText, Landmark, LucideProps, Mail, Megaphone, MessageSquareHeart,
    NotebookPen, ShieldCheck, Sparkles, UserPlus, Workflow,
} from "lucide-react"

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
    quote: FileText,
    email: Mail,
    social: Megaphone,
    feedback: MessageSquareHeart,
    jobad: UserPlus,
    meeting: NotebookPen,
    automation: Workflow,
    funding: Landmark,
    contract: FileSearch,
    aiact: ShieldCheck,
}

export function ToolIcon({ slug, ...props }: { slug: string } & LucideProps) {
    const Icon = ICONS[slug] ?? Sparkles
    return <Icon {...props} />
}
