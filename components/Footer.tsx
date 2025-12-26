'use client';

import Link from 'next/link';
import {
    Brain,
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    ArrowRight,
    Shield,
    Award,
    Zap
} from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement newsletter subscription
        setSubscribed(true);
        setTimeout(() => {
            setSubscribed(false);
            setEmail('');
        }, 3000);
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
            {/* Newsletter Section */}
            <div className="border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                Stay ahead with AI insights
                            </h3>
                            <p className="text-gray-400">
                                Get the latest updates on business intelligence, AI trends, and exclusive tips delivered to your inbox.
                            </p>
                        </div>
                        <div>
                            <form onSubmit={handleSubscribe} className="flex gap-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                                />
                                <button
                                    type="submit"
                                    disabled={subscribed}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-600/30"
                                >
                                    {subscribed ? (
                                        <>
                                            <span>✓</span>
                                            Subscribed
                                        </>
                                    ) : (
                                        <>
                                            Subscribe
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Voon Business</span>
                        </Link>
                        <p className="text-gray-400 mb-6 max-w-sm">
                            Empowering businesses with AI-powered intelligence and data-driven insights.
                            Transform your decision-making with cutting-edge analytics.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <a href="mailto:info@voon.fi" className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors">
                                <Mail className="w-5 h-5" />
                                <span>info@voon.fi</span>
                            </a>
                            <a href="tel:+358401234567" className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors">
                                <Phone className="w-5 h-5" />
                                <span>+358 40 123 4567</span>
                            </a>
                            <div className="flex items-center gap-3 text-gray-400">
                                <MapPin className="w-5 h-5" />
                                <span>Helsinki, Finland</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/features" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/test" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Free Diagnostic
                                </Link>
                            </li>
                            <li>
                                <Link href="/integrations" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Integrations
                                </Link>
                            </li>
                            <li>
                                <Link href="/changelog" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Changelog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/press" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Press Kit
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Resources</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/docs" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="/help" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/api" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    API Reference
                                </Link>
                            </li>
                            <li>
                                <Link href="/community" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link href="/status" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    System Status
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-gray-700/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h5 className="text-white font-semibold">GDPR Compliant</h5>
                            <p className="text-sm text-gray-400">Your data is safe</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                            <Award className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h5 className="text-white font-semibold">ISO 27001 Certified</h5>
                            <p className="text-sm text-gray-400">Enterprise security</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                            <Zap className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h5 className="text-white font-semibold">99.9% Uptime</h5>
                            <p className="text-sm text-gray-400">Always available</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                        <p>© {currentYear} Voon Business Intelligence. All rights reserved.</p>
                        <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-blue-400 transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/cookies" className="hover:text-blue-400 transition-colors">
                            Cookie Policy
                        </Link>
                        <Link href="/gdpr" className="hover:text-blue-400 transition-colors">
                            GDPR
                        </Link>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://linkedin.com/company/voon"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                            href="https://twitter.com/voon"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href="https://facebook.com/voon"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="Facebook"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a
                            href="https://instagram.com/voon"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="https://youtube.com/@voon"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="YouTube"
                        >
                            <Youtube className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
