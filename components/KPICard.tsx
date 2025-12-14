import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KPICardProps {
    title: string
    value: string | number
    change?: number
    trend?: 'up' | 'down' | 'neutral'
    subtext?: string
}

export function KPICard({ title, value, change, trend, subtext }: KPICardProps) {
    return (
        <div className="p-6 rounded-xl border bg-card shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">{value}</span>
                {change !== undefined && (
                    <span className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-emerald-600' :
                            trend === 'down' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                        {trend === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
                        {trend === 'down' && <TrendingDown className="h-4 w-4 mr-1" />}
                        {trend === 'neutral' && <Minus className="h-4 w-4 mr-1" />}
                        {Math.abs(change)}%
                    </span>
                )}
            </div>
            {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
    )
}
