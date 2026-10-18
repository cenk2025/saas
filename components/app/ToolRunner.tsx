"use client"

import { useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Check, Copy, FolderPlus, Loader2, RotateCcw, Sparkles, Square } from "lucide-react"
import { Markdown } from "@/components/Markdown"
import type { ToolDefinition } from "@/lib/ai/tool-catalog"
import { readTextStream } from "@/lib/stream"

type SaveState = "idle" | "saving" | "saved" | "error"

export function ToolRunner({ tool }: { tool: ToolDefinition }) {
    const t = useTranslations("Tools")
    const tw = useTranslations("Workspace")
    const locale = useLocale()

    const [values, setValues] = useState<Record<string, string>>(() =>
        Object.fromEntries(tool.fields.map((field) => [field.id, field.type === "select" && field.required ? field.options![0] : ""]))
    )
    const [output, setOutput] = useState("")
    const [running, setRunning] = useState(false)
    const [error, setError] = useState("")
    const [copied, setCopied] = useState(false)
    const [saveState, setSaveState] = useState<SaveState>("idle")
    const abortRef = useRef<AbortController | null>(null)

    const label = (fieldId: string) => t(`${tool.slug}.fields.${fieldId}.label`)
    const placeholder = (fieldId: string) =>
        t.has(`${tool.slug}.fields.${fieldId}.placeholder`) ? t(`${tool.slug}.fields.${fieldId}.placeholder`) : undefined

    const run = async (e?: React.FormEvent) => {
        e?.preventDefault()
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller

        setRunning(true)
        setError("")
        setOutput("")
        setSaveState("idle")

        try {
            const res = await fetch(`/api/tools/${tool.slug}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ values, locale }),
                signal: controller.signal,
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            await readTextStream(res, setOutput)
        } catch (err) {
            if ((err as Error).name !== "AbortError") setError(tw("error"))
        } finally {
            setRunning(false)
        }
    }

    const stop = () => abortRef.current?.abort()

    const copy = async () => {
        await navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const save = async () => {
        setSaveState("saving")
        const firstValue = tool.fields.map((field) => values[field.id]).find((value) => value && value.length > 0) ?? ""
        const title = `${t(`${tool.slug}.name`)}: ${firstValue.replace(/\s+/g, " ").slice(0, 80)}`
        try {
            const res = await fetch("/api/documents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tool: tool.slug, title, input: values, output }),
            })
            setSaveState(res.ok ? "saved" : "error")
        } catch {
            setSaveState("error")
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <form onSubmit={run} className="card h-fit space-y-5 p-5 sm:p-6 lg:sticky lg:top-6">
                {tool.fields.map((field) => (
                    <div key={field.id}>
                        <label id={`${field.id}-label`} htmlFor={field.id} className="label flex items-center justify-between">
                            {label(field.id)}
                            {!field.required && <span className="text-xs font-normal text-muted-foreground">{tw("optional")}</span>}
                        </label>
                        {field.type === "textarea" && (
                            <textarea
                                id={field.id}
                                required={field.required}
                                rows={field.rows ?? 5}
                                maxLength={field.maxLength}
                                value={values[field.id]}
                                onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                                placeholder={placeholder(field.id)}
                                className="input resize-y"
                            />
                        )}
                        {field.type === "text" && (
                            <input
                                id={field.id}
                                required={field.required}
                                maxLength={field.maxLength}
                                value={values[field.id]}
                                onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                                placeholder={placeholder(field.id)}
                                className="input"
                            />
                        )}
                        {field.type === "select" && (
                            <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby={`${field.id}-label`}>
                                {field.options!.map((option) => {
                                    const selected = values[field.id] === option
                                    return (
                                        <button
                                            key={option}
                                            type="button"
                                            role="radio"
                                            aria-checked={selected}
                                            onClick={() => setValues((v) => ({ ...v, [field.id]: selected && !field.required ? "" : option }))}
                                            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${selected ? "border-ink bg-ink text-white" : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`}
                                        >
                                            {t(`${tool.slug}.options.${field.id}.${option}`)}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                ))}

                <p className="text-xs text-muted-foreground">{tw("privacyHint")}</p>

                {running ? (
                    <button type="button" onClick={stop} className="btn-secondary w-full py-3">
                        <Square className="h-4 w-4" /> {tw("stop")}
                    </button>
                ) : (
                    <button type="submit" className="btn-primary w-full py-3">
                        <Sparkles className="h-4 w-4" /> {tw("generate")}
                    </button>
                )}
            </form>

            <section className="card flex min-h-[420px] flex-col" aria-live="polite">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
                    <h2 className="flex items-center gap-2 text-sm font-semibold">
                        {running && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                        {running ? tw("generating") : tw("result")}
                    </h2>
                    {output && !running && (
                        <div className="flex flex-wrap gap-1">
                            <button type="button" onClick={copy} className="btn-ghost">
                                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                                {copied ? tw("copied") : tw("copy")}
                            </button>
                            <button type="button" onClick={() => run()} className="btn-ghost">
                                <RotateCcw className="h-4 w-4" /> {tw("regenerate")}
                            </button>
                            <button type="button" onClick={save} disabled={saveState === "saving" || saveState === "saved"} className="btn-ghost disabled:opacity-100">
                                {saveState === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : saveState === "saved" ? <Check className="h-4 w-4 text-success" /> : <FolderPlus className="h-4 w-4" />}
                                {saveState === "saved" ? tw("saved") : tw("save")}
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex-1 p-5 sm:p-6">
                    {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">{error}</p>}
                    {saveState === "error" && <p className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">{tw("saveFailed")}</p>}
                    {output ? (
                        <Markdown>{output}</Markdown>
                    ) : (
                        !error && (
                            <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
                                {running ? (
                                    <div className="w-full max-w-md space-y-3">
                                        {[90, 75, 82, 60].map((w, i) => (
                                            <div key={i} className="h-3 animate-pulse rounded-full bg-muted" style={{ width: `${w}%` }} />
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <Sparkles className="h-8 w-8 text-brand-gray" />
                                        {tw("emptyResult")}
                                    </>
                                )}
                            </div>
                        )
                    )}
                </div>
            </section>
        </div>
    )
}
