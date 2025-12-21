"use client"

import { jsPDF } from "jspdf"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"

interface ReportData {
    score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    date: string;
}

export function DownloadReportButton({ report }: { report: any }) {
    const [loading, setLoading] = useState(false)

    const handleDownload = () => {
        setLoading(true)
        const doc = new jsPDF()

        // Title
        doc.setFontSize(22)
        doc.setTextColor(40, 40, 40)
        doc.text("Company Diagnostic Report", 20, 20)

        // Metadata
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Date: ${new Date(report.created_at || report.createdAt).toLocaleDateString()}`, 20, 30)
        doc.text(`Score: ${report.score}/100`, 20, 35)

        // Summary
        doc.setFontSize(16)
        doc.setTextColor(0, 0, 0)
        doc.text("Executive Summary", 20, 50)

        doc.setFontSize(12)
        doc.setTextColor(60, 60, 60)
        const splitSummary = doc.splitTextToSize(report.summary, 170)
        doc.text(splitSummary, 20, 60)

        let yPos = 60 + (splitSummary.length * 7) + 10

        // Recommendations
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFontSize(16)
        doc.setTextColor(0, 0, 0)
        doc.text("Recommended Actions", 20, yPos)
        yPos += 10

        doc.setFontSize(12)
        doc.setTextColor(60, 60, 60)
        report.recommendations.forEach((rec: string, i: number) => {
            const text = `${i + 1}. ${rec}`
            const splitText = doc.splitTextToSize(text, 170)
            doc.text(splitText, 20, yPos)
            yPos += (splitText.length * 7) + 5
        })

        // Weaknesses
        yPos += 10
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFontSize(16)
        doc.setTextColor(0, 0, 0)
        doc.text("Areas for Improvement", 20, yPos)
        yPos += 10

        doc.setFontSize(12)
        report.weaknesses.forEach((weak: string, i: number) => {
            const text = `• ${weak}`
            const splitText = doc.splitTextToSize(text, 170)
            doc.text(splitText, 20, yPos)
            yPos += (splitText.length * 7) + 5
        })

        doc.save(`clarity-report-${new Date(report.created_at || report.createdAt).toISOString().split('T')[0]}.pdf`)
        setLoading(false)
    }

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download PDF
        </button>
    )
}
