"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, Building2, Mail, Lock, Chrome, Linkedin } from "lucide-react"
import { useTranslations } from "next-intl"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const [ssoLoading, setSsoLoading] = useState<string | null>(null)
    const [error, setError] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
    const t = useTranslations()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (res?.error) {
                setError("Invalid email or password")
                setLoading(false)
            } else {
                router.push(callbackUrl)
                router.refresh()
            }
        } catch (err) {
            setError("An unexpected error occurred")
            setLoading(false)
        }
    }

    const handleSSOLogin = async (provider: string) => {
        setSsoLoading(provider)
        try {
            await signIn(provider, { callbackUrl })
        } catch (err) {
            setError(`Failed to sign in with ${provider}`)
            setSsoLoading(null)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/30 via-background to-muted/20">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                        <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to access your business insights
                    </p>
                </div>

                <div className="bg-card p-8 rounded-2xl shadow-lg border border-border/50 backdrop-blur-sm">
                    {/* SSO Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleSSOLogin("google")}
                            disabled={ssoLoading !== null}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {ssoLoading === "google" ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Chrome className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            )}
                            <span className="text-sm font-medium">Continue with Google</span>
                        </button>

                        <button
                            onClick={() => handleSSOLogin("azure-ad")}
                            disabled={ssoLoading !== null}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {ssoLoading === "azure-ad" ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" viewBox="0 0 23 23" fill="currentColor">
                                    <path d="M0 0h10.931v10.931H0zm12.069 0H23v10.931H12.069zM0 12.069h10.931V23H0zm12.069 0H23V23H12.069z" />
                                </svg>
                            )}
                            <span className="text-sm font-medium">Continue with Microsoft</span>
                        </button>

                        <button
                            onClick={() => handleSSOLogin("linkedin")}
                            disabled={ssoLoading !== null}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {ssoLoading === "linkedin" ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            )}
                            <span className="text-sm font-medium">Continue with LinkedIn</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium leading-6 text-foreground mb-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    Work Email
                                </div>
                            </label>
                            <input
                                id="email-address"
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

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-foreground mb-2">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                    Password
                                </div>
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-lg border-0 py-3 px-4 text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm bg-background transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground cursor-pointer">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
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
                            Sign in to your account
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="text-center text-xs text-muted-foreground bg-card/50 p-4 rounded-lg border border-border/30">
                    <p className="font-medium mb-2">Demo Credentials:</p>
                    <p>Admin: admin@clarity.ai / password123</p>
                    <p>Manager: manager1@corpA.com / password123</p>
                </div>

                {/* Trust Indicators */}
                <div className="text-center text-xs text-muted-foreground">
                    <p>🔒 Secure & encrypted • GDPR compliant • SOC 2 certified</p>
                </div>
            </div>
        </div>
    )
}
