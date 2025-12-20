"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Failed to send reset email")
                setLoading(false)
                return
            }

            setSent(true)
            setLoading(false)
        } catch (err) {
            setError("An unexpected error occurred")
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/30 via-background to-muted/20">
                <div className="w-full max-w-md space-y-8">
                    <div className="bg-card p-8 rounded-2xl shadow-lg border border-border/50 backdrop-blur-sm text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Check your email
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            We've sent password reset instructions to <strong>{email}</strong>
                        </p>
                        <p className="text-xs text-muted-foreground mb-6">
                            Didn't receive the email? Check your spam folder or{" "}
                            <button
                                onClick={() => setSent(false)}
                                className="text-primary hover:text-primary/80 font-medium"
                            >
                                try again
                            </button>
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/30 via-background to-muted/20">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your email address and we'll send you instructions to reset your password
                    </p>
                </div>

                <div className="bg-card p-8 rounded-2xl shadow-lg border border-border/50 backdrop-blur-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    Email address
                                </div>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-lg border-0 py-3 px-4 text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm bg-background transition-all"
                                placeholder="name@company.com"
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-destructive font-medium text-center bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                            Send reset instructions
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to sign in
                        </Link>
                    </div>
                </div>

                {/* Help Text */}
                <div className="text-center text-xs text-muted-foreground bg-card/50 p-4 rounded-lg border border-border/30">
                    <p>Need help? Contact our support team at <a href="mailto:support@voon.fi" className="text-primary hover:text-primary/80">support@voon.fi</a></p>
                </div>
            </div>
        </div>
    )
}
