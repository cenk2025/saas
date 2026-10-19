"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { EmailComposer, Recipient } from "./EmailComposer"

export function EmailButton({ recipients, label, variant = "primary" }: { recipients: Recipient[]; label: string; variant?: "primary" | "secondary" }) {
    const [open, setOpen] = useState(false)
    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className={variant === "primary" ? "btn-primary shrink-0" : "btn-secondary shrink-0"}>
                <Mail className="h-4 w-4" /> {label}
            </button>
            {open && <EmailComposer recipients={recipients} onClose={() => setOpen(false)} />}
        </>
    )
}
