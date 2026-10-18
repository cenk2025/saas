"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Check, Copy, Loader2, Trash2 } from "lucide-react"
import { useRouter } from "@/src/i18n/navigation"

export function DocumentActions({ id, text }: { id: string; text: string }) {
    const tw = useTranslations("Workspace")
    const router = useRouter()
    const [copied, setCopied] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const copy = async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const remove = async () => {
        if (!confirm(tw("deleteConfirm"))) return
        setDeleting(true)
        const res = await fetch(`/api/documents/${id}`, { method: "DELETE" })
        if (res.ok) {
            router.push("/library")
            router.refresh()
        } else {
            setDeleting(false)
        }
    }

    return (
        <div className="flex shrink-0 gap-1">
            <button type="button" onClick={copy} className="btn-ghost">
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                {copied ? tw("copied") : tw("copy")}
            </button>
            <button type="button" onClick={remove} disabled={deleting} className="btn-ghost hover:text-destructive">
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {tw("delete")}
            </button>
        </div>
    )
}
