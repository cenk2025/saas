"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Building2, Mail, Lock, User, Phone, Globe, Chrome, Linkedin } from "lucide-react"

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        companyName: "",
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        country: "",
        acceptTerms: false,
    })
    const [loading, setLoading] = useState(false)
    const [ssoLoading, setSsoLoading] = useState<string | null>(null)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (!formData.acceptTerms) {
            setError("Please accept the terms and conditions")
            return
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Registration failed")
                setLoading(false)
                return
            }

            // Redirect to login with success message
            router.push("/login?registered=true")
        } catch (err) {
            setError("An unexpected error occurred")
            setLoading(false)
        }
    }

    const handleSSORegister = async (provider: string) => {
        setSsoLoading(provider)
        // SSO registration logic here
        // This would typically redirect to the provider's OAuth flow
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/30 via-background to-muted/20">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                        <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Start your free trial
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Get 14 days of unlimited access. No credit card required.
                    </p>
                </div>

                <div className="bg-card p-8 rounded-2xl shadow-lg border border-border/50 backdrop-blur-sm">
                    {/* SSO Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                        <button
                            onClick={() => handleSSORegister("google")}
                            disabled={ssoLoading !== null}
                            className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {ssoLoading === "google" ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Chrome className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            )}
                            <span className="text-sm font-medium">Google</span>
                        </button>

                        <button
                            onClick={() => handleSSORegister("azure-ad")}
                            disabled={ssoLoading !== null}
                            className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {ssoLoading === "azure-ad" ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" viewBox="0 0 23 23" fill="currentColor">
                                    <path d="M0 0h10.931v10.931H0zm12.069 0H23v10.931H12.069zM0 12.069h10.931V23H0zm12.069 0H23V23H12.069z" />
                                </svg>
                            )}
                            <span className="text-sm font-medium">Microsoft</span>
                        </button>

                        <button
                            onClick={() => handleSSORegister("linkedin")}
                            disabled={ssoLoading !== null}
                            className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {ssoLoading === "linkedin" ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            )}
                            <span className="text-sm font-medium">LinkedIn</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or register with email</span>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Company Information */}
                        <div className="space-y-4 pb-4 border-b border-border/50">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                Company Information
                            </h3>

                            <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-foreground mb-2">
                                    Company Name *
                                </label>
                                <input
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    required
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-0 py-3 px-4 text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm bg-background transition-all"
                                    placeholder="Acme Corporation"
                                />
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-foreground mb-2">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-muted-foreground" />
                                        Country *
                                    </div>
                                </label>
                                <select
                                    id="country"
                                    name="country"
                                    required
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-0 py-3 px-4 text-foreground shadow-sm ring-1 ring-inset ring-input focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm bg-background transition-all"
                                >
                                    <option value="">Select a country</option>
                                    <option value="FI">Finland</option>
                                    <option value="SE">Sweden</option>
                                    <option value="NO">Norway</option>
                                    <option value="DK">Denmark</option>
                                    <option value="US">United States</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="DE">Germany</option>
                                    <option value="FR">France</option>
                                    <option value="ES">Spain</option>
                                    <option value="IT">Italy</option>
                                    <option value="NL">Netherlands</option>
                                </select>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Your Information
                            </h3>

                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                                    Full Name *
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-0 py-3 px-4 text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm bg-background transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            Work Email *
                                        </div>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border-0 py-3 px-4 text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm bg-background transition-all"
                                        placeholder="john@company.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            Phone (Optional)
                                        </div>
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border-0 py-3 px-4 text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm bg-background transition-all"
                                        placeholder="+358 40 123 4567"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                        <div className="flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-muted-foreground" />
                                            Password *
                                        </div>
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border-0 py-3 px-4 text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm bg-background transition-all"
                                        placeholder="Min. 8 characters"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                                        Confirm Password *
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border-0 py-3 px-4 text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm bg-background transition-all"
                                        placeholder="Repeat password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-start pt-2">
                            <input
                                id="acceptTerms"
                                name="acceptTerms"
                                type="checkbox"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer mt-1"
                            />
                            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-muted-foreground cursor-pointer">
                                I agree to the{" "}
                                <Link href="/terms" className="text-primary hover:text-primary/80 font-medium">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium">
                                    Privacy Policy
                                </Link>
                            </label>
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
                            Create your account
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="text-center space-y-2">
                    <div className="text-xs text-muted-foreground">
                        <p>🔒 Secure & encrypted • GDPR compliant • SOC 2 certified</p>
                    </div>
                    <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                        <span>✓ 14-day free trial</span>
                        <span>✓ No credit card required</span>
                        <span>✓ Cancel anytime</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
