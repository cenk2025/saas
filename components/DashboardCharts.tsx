"use client"

import {
    Line, LineChart, CartesianGrid, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart,
    ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts"

interface ChartProps {
    data: Record<string, string | number>[]
    type?: "line" | "radar"
    dataKey?: string
}

const BRAND = "#e23d96"
const tooltipStyle = { backgroundColor: "#fff", borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }

export function DataChart({ data, type = "line", dataKey = "score" }: ChartProps) {
    if (type === "radar") {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey={dataKey} stroke={BRAND} fill={BRAND} fillOpacity={0.18} strokeWidth={2} />
                    <Tooltip contentStyle={tooltipStyle} />
                </RadarChart>
            </ResponsiveContainer>
        )
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey={dataKey} stroke={BRAND} strokeWidth={2.5} dot={{ r: 3.5, fill: "#fff", strokeWidth: 2 }} activeDot={{ r: 5 }} />
            </LineChart>
        </ResponsiveContainer>
    )
}
