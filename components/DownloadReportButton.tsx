"use client"

import { jsPDF } from "jspdf"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"

interface ReportForPdf {
    score: number
    summary: string
    created_at: string
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
    categoryScores: [string, number][]
}

interface PdfLabels {
    button: string
    title: string
    summary: string
    strengths: string
    weaknesses: string
    recommendations: string
    categories: string
}

const MARGIN = 20
const WIDTH = 170

export function DownloadReportButton({ report, labels }: { report: ReportForPdf; labels: PdfLabels }) {
    const [loading, setLoading] = useState(false)

    const handleDownload = () => {
        setLoading(true)
        const doc = new jsPDF()
        let y = 0

        const ensureSpace = (needed: number) => {
            if (y + needed > 280) {
                doc.addPage()
                y = MARGIN
            }
        }

        const heading = (text: string) => {
            ensureSpace(16)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(14)
            doc.setTextColor(22, 19, 26)
            doc.text(text, MARGIN, y)
            y += 8
        }

        const paragraph = (text: string, prefix = "") => {
            doc.setFont("helvetica", "normal")
            doc.setFontSize(11)
            doc.setTextColor(70, 66, 74)
            const lines = doc.splitTextToSize(`${prefix}${text}`, WIDTH)
            ensureSpace(lines.length * 6)
            doc.text(lines, MARGIN, y)
            y += lines.length * 6 + 3
        }

        // Brand header: orange → pink bar
        doc.setFillColor(255, 169, 112)
        doc.rect(0, 0, 105, 6, "F")
        doc.setFillColor(242, 64, 159)
        doc.rect(105, 0, 105, 6, "F")

        y = 24
        doc.setFont("helvetica", "bold")
        doc.setFontSize(20)
        doc.setTextColor(22, 19, 26)
        doc.text(labels.title, MARGIN, y)
        y += 8
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        doc.setTextColor(102, 97, 108)
        doc.text(`${new Date(report.created_at).toLocaleDateString()} · Voon Business · business.voon.fi`, MARGIN, y)

        doc.setFont("helvetica", "bold")
        doc.setFontSize(36)
        doc.setTextColor(226, 61, 150)
        doc.text(`${report.score}`, 190, 30, { align: "right" })
        doc.setFontSize(10)
        doc.text("/ 100", 190, 36, { align: "right" })

        y += 14
        paragraph(report.summary)
        y += 4

        heading(labels.categories)
        report.categoryScores.forEach(([name, value]) => {
            ensureSpace(10)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(11)
            doc.setTextColor(70, 66, 74)
            doc.text(name, MARGIN, y)
            doc.text(String(value), 190, y, { align: "right" })
            doc.setFillColor(243, 242, 244)
            doc.rect(MARGIN, y + 2, WIDTH, 2, "F")
            doc.setFillColor(242, 64, 159)
            doc.rect(MARGIN, y + 2, (WIDTH * value) / 100, 2, "F")
            y += 10
        })
        y += 4

        heading(labels.recommendations)
        report.recommendations.forEach((rec, i) => paragraph(rec, `${i + 1}. `))
        y += 4

        if (report.strengths.length > 0) {
            heading(labels.strengths)
            report.strengths.forEach((item) => paragraph(item, "• "))
            y += 4
        }

        heading(labels.weaknesses)
        report.weaknesses.forEach((item) => paragraph(item, "• "))

        doc.save(`voon-business-report-${new Date(report.created_at).toISOString().split("T")[0]}.pdf`)
        setLoading(false)
    }

    return (
        <button type="button" onClick={handleDownload} disabled={loading} className="btn-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {labels.button}
        </button>
    )
}
