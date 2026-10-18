import Image from "next/image"

export function Logo({ className = "h-7 w-auto" }: { className?: string }) {
    return (
        <span className="inline-flex items-center gap-2">
            <Image src="/logo.png" alt="VOON IQ" width={1200} height={346} priority className={className} />
            <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Business
            </span>
        </span>
    )
}
