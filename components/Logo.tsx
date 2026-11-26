import Image from "next/image"

/**
 * VOON IQ wordmark (the real logo file, never typed text) followed by the product name.
 * `tone="light"` uses the white wordmark for dark backgrounds.
 */
export function Logo({ className = "h-7 w-auto", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
    const light = tone === "light"
    return (
        <span className="inline-flex items-center gap-2.5">
            <Image
                src={light ? "/brand/voon-logo-white.png" : "/brand/voon-logo-color.png"}
                alt="VOON IQ"
                width={light ? 1662 : 1902}
                height={light ? 470 : 537}
                priority
                className={className}
            />
            <span className={`text-[17px] font-medium tracking-[-0.02em] ${light ? "text-white/80" : "text-muted-foreground"}`}>
                Business
            </span>
        </span>
    )
}
