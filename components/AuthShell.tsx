export function AuthShell({ title, subtitle, children, footer, wide = false }: {
    title: string
    subtitle?: string
    children: React.ReactNode
    footer?: React.ReactNode
    wide?: boolean
}) {
    return (
        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-14 sm:px-6">
            <div aria-hidden className="pointer-events-none absolute -top-48 left-1/2 h-96 w-[700px] -translate-x-1/2 rounded-full bg-brand-gradient opacity-10 blur-3xl" />
            <div className={`relative w-full ${wide ? "max-w-xl" : "max-w-md"}`}>
                <div className="text-center">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
                </div>
                <div className="card mt-8 p-6 shadow-xl shadow-black/5 sm:p-8">{children}</div>
                {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
            </div>
        </div>
    )
}

export function FormMessage({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
    return (
        <p className={`rounded-xl p-3 text-sm font-medium ${tone === "error" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
            {children}
        </p>
    )
}
