"use client"

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    BarChart, Bar
} from 'recharts'

interface ChartProps {
    data: any[]
    type?: 'line' | 'radar' | 'bar'
    dataKey?: string
    color?: string
}

export function DataChart({ data, type = 'line', dataKey = 'value', color = "var(--primary)" }: ChartProps) {
    if (type === 'radar') {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Score"
                        dataKey={dataKey}
                        stroke={color}
                        fill={color}
                        fillOpacity={0.3}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'var(--popover)', borderRadius: '8px', border: '1px solid var(--border)' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        )
    }

    if (type === 'bar') {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--popover)', borderRadius: '8px', border: '1px solid var(--border)' }} />
                    <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        )
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                    dataKey="date"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: 'var(--popover)', borderRadius: '8px', border: '1px solid var(--border)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                />
                <Line
                    type="monotone"
                    dataKey="score"
                    stroke={color}
                    strokeWidth={3}
                    dot={{ r: 4, fill: 'var(--background)', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
