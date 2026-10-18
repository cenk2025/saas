import { useId } from "react"

export function ScoreRing({ score, size = 96, label }: { score: number; size?: number; label?: string }) {
    const gradientId = useId()
    const radius = 42
    const circumference = 2 * Math.PI * radius
    const clamped = Math.max(0, Math.min(100, score))

    return (
        <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={label ?? `${clamped} / 100`} className="shrink-0">
            <defs>
                <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ffa970" />
                    <stop offset="100%" stopColor="#f2409f" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--muted)" strokeWidth="9" />
            <circle
                cx="50" cy="50" r={radius} fill="none" stroke={`url(#${gradientId})`} strokeWidth="9" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={circumference * (1 - clamped / 100)}
                transform="rotate(-90 50 50)"
            />
            <text x="50" y="58" textAnchor="middle" fontSize="24" fontWeight="700" fill="currentColor" style={{ fontFamily: "var(--font-display)" }}>
                {clamped}
            </text>
        </svg>
    )
}
