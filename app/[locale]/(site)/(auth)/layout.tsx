import type { Metadata } from "next"

// Login, registration and password pages are for people, not search results. Without this they
// inherited the home page's canonical from the locale layout.
export const metadata: Metadata = {
    robots: { index: false, follow: true },
    alternates: { canonical: null },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return children
}
