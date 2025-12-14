"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle } from "lucide-react"

const QUESTIONS = [
    {
        id: "efficiency_process",
        category: "Operational Efficiency",
        label: "How clearly (1-10) are your operational processes defined and documented?",
        type: "range"
    },
    {
        id: "efficiency_automation",
        category: "Operational Efficiency",
        label: "To what extent are your core workflows automated?",
        type: "select",
        options: ["Manual", "Some tools", "Mostly automated", "fully automated"]
    },
    {
        id: "digital_tools",
        category: "Digital Maturity",
        label: "How integrated are your digital tools across departments?",
        type: "select",
        options: ["Siloed", "Some integration", "Integrated ecosystem", "Real-time sync"]
    },
    {
        id: "digital_data",
        category: "Digital Maturity",
        label: "How often do you use data analytics for decision making?",
        type: "select",
        options: ["Rarely", "Monthly", "Weekly", "Daily"]
    },
    {
        id: "hr_training",
        category: "HR Capability",
        label: "Do you have a formal continuous learning/training program?",
        type: "select",
        options: ["No", "Ad-hoc", "Formal program", "Comprehensive L&D culture"]
    },
    {
        id: "hr_satisfaction",
        category: "HR Capability",
        label: "Rate your employee retention/satisfaction (1-10).",
        type: "range"
    },
    {
        id: "innovation_budget",
        category: "Innovation",
        label: "What % of budget is allocated to R&D or new initiatives?",
        type: "select",
        options: ["0%", "1-5%", "5-10%", "10%+"]
    },
    {
        id: "innovation_speed",
        category: "Innovation",
        label: "How fast can you launch a new product/feature from idea to market?",
        type: "select",
        options: ["Years", "Months", "Weeks", "Days"]
    },
    {
        id: "risk_compliance",
        category: "Risk Awareness",
        label: "How regularly do you audit for compliance and security risks?",
        type: "select",
        options: ["Never", "Annually", "Quarterly", "Continuous monitoring"]
    },
    {
        id: "risk_resilience",
        category: "Risk Awareness",
        label: "Do you have a tested disaster recovery plan?",
        type: "select",
        options: ["No", "Drafted but untested", "Tested annually", "Robust & automated"]
    }
]

export default function DiagnosticPage() {
    const router = useRouter()
    const [answers, setAnswers] = useState<Record<string, string | number>>({})
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers })
            })

            if (res.ok) {
                router.push("/dashboard")
                router.refresh()
            } else {
                alert("Failed to submit analysis")
                setLoading(false)
            }
        } catch (error) {
            console.error(error)
            setLoading(false)
            alert("Error submitting analysis")
        }
    }

    const handleChange = (id: string, value: string | number) => {
        setAnswers(prev => ({ ...prev, [id]: value }))
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Company Diagnostic Test</h1>
                <p className="text-muted-foreground">Answer these 10 questions to get an AI-powered analysis of your business health.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 rounded-xl border shadow-sm">
                {QUESTIONS.map((q) => (
                    <div key={q.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-lg font-medium">{q.label}</label>
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded">{q.category}</span>
                        </div>

                        {q.type === "select" && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {q.options?.map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => handleChange(q.id, opt)}
                                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${answers[q.id] === opt
                                                ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary ring-offset-2"
                                                : "bg-background hover:bg-muted"
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {q.type === "range" && (
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs text-muted-foreground px-1">
                                    <span>Poor (1)</span>
                                    <span>Excellent (10)</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    value={answers[q.id] || 5}
                                    onChange={(e) => handleChange(q.id, parseInt(e.target.value))}
                                />
                                <div className="text-center font-bold text-primary text-xl">
                                    {answers[q.id] || 5}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <div className="pt-6 border-t">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-lg text-lg hover:bg-primary/90 transition-all flex items-center justify-center disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                Analyzing with AI...
                            </>
                        ) : (
                            "Generate Report"
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
