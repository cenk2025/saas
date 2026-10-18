// Business health check questions. UI labels are in messages/*.json under
// "Diagnostic.questions.<id>"; the English text below is what the AI sees.

export interface DiagnosticQuestion {
    id: string
    category: DiagnosticCategory
    type: "range" | "select"
    prompt: string
    options?: string[]
}

export type DiagnosticCategory = "operations" | "digital" | "people" | "innovation" | "risk" | "finance"

// The AI scores these five areas; keys are stored as-is in diagnostic_reports.category_scores
export const SCORE_CATEGORY_SLUGS: Record<string, string> = {
    "Operational Efficiency": "operations",
    "Digital Maturity": "digital",
    "Innovation Capability": "innovation",
    "Financial Health": "finance",
    "Risk Management": "risk",
}

export const QUESTIONS: DiagnosticQuestion[] = [
    { id: "efficiency_process", category: "operations", type: "range", prompt: "How clearly (1-10) are operational processes defined and documented?" },
    { id: "efficiency_automation", category: "operations", type: "select", prompt: "To what extent are core workflows automated?", options: ["manual", "someTools", "mostly", "fully"] },
    { id: "digital_tools", category: "digital", type: "select", prompt: "How integrated are digital tools across teams?", options: ["siloed", "some", "integrated", "realtime"] },
    { id: "digital_data", category: "digital", type: "select", prompt: "How often is data used for decision making?", options: ["rarely", "monthly", "weekly", "daily"] },
    { id: "ai_usage", category: "digital", type: "select", prompt: "How is AI used in the company today?", options: ["none", "individual", "someProcesses", "strategic"] },
    { id: "hr_training", category: "people", type: "select", prompt: "Is there a continuous learning / training programme?", options: ["no", "adHoc", "formal", "culture"] },
    { id: "hr_satisfaction", category: "people", type: "range", prompt: "Employee retention and satisfaction (1-10)." },
    { id: "innovation_budget", category: "innovation", type: "select", prompt: "Share of budget allocated to development and new initiatives?", options: ["0", "1-5", "5-10", "10+"] },
    { id: "innovation_speed", category: "innovation", type: "select", prompt: "How fast can a new product or service go from idea to market?", options: ["years", "months", "weeks", "days"] },
    { id: "risk_compliance", category: "risk", type: "select", prompt: "How regularly are compliance, data protection and security risks reviewed?", options: ["never", "annually", "quarterly", "continuous"] },
    { id: "risk_resilience", category: "risk", type: "select", prompt: "Is there a tested continuity / disaster recovery plan?", options: ["no", "drafted", "tested", "automated"] },
    { id: "finance_visibility", category: "finance", type: "select", prompt: "How well does management see cash flow and profitability in real time?", options: ["poor", "monthly", "weekly", "realtime"] },
]
