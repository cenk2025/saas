'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Shield, BarChart3, Settings } from 'lucide-react';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true, // Always true, cannot be disabled
        analytics: false,
        marketing: false,
        functional: false,
    });

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Show banner after a short delay for better UX
            setTimeout(() => setShowBanner(true), 1000);
        } else {
            // Load saved preferences
            try {
                const saved = JSON.parse(consent);
                setPreferences(saved);
            } catch (e) {
                console.error('Failed to parse cookie consent:', e);
            }
        }
    }, []);

    const acceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true,
        };
        setPreferences(allAccepted);
        localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
        setShowBanner(false);
        setShowSettings(false);
    };

    const acceptNecessary = () => {
        const necessaryOnly = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false,
        };
        setPreferences(necessaryOnly);
        localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
        setShowBanner(false);
        setShowSettings(false);
    };

    const savePreferences = () => {
        localStorage.setItem('cookie-consent', JSON.stringify(preferences));
        setShowBanner(false);
        setShowSettings(false);
    };

    const togglePreference = (key: keyof typeof preferences) => {
        if (key === 'necessary') return; // Cannot disable necessary cookies
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!showBanner) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${showSettings ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setShowSettings(false)}
            />

            {/* Cookie Banner */}
            <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-slide-up">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {!showSettings ? (
                            // Simple Banner
                            <div className="p-6 md:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                        <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            We value your privacy
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                                            By clicking "Accept All", you consent to our use of cookies.
                                        </p>

                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={acceptAll}
                                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg shadow-blue-600/30"
                                            >
                                                Accept All
                                            </button>
                                            <button
                                                onClick={acceptNecessary}
                                                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors duration-200"
                                            >
                                                Necessary Only
                                            </button>
                                            <button
                                                onClick={() => setShowSettings(true)}
                                                className="px-6 py-2.5 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200 border border-gray-300 dark:border-gray-600"
                                            >
                                                <Settings className="w-4 h-4 inline mr-2" />
                                                Customize
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={acceptNecessary}
                                        className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        aria-label="Close"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Detailed Settings
                            <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Cookie Preferences
                                    </h3>
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                                    We use different types of cookies to optimize your experience on our website.
                                    Click on the different category headings to find out more and change our default settings.
                                </p>

                                <div className="space-y-4">
                                    {/* Necessary Cookies */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    Necessary Cookies
                                                </h4>
                                            </div>
                                            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                                                Always Active
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 ml-8">
                                            These cookies are essential for the website to function properly. They enable basic functions like page navigation,
                                            access to secure areas, and authentication.
                                        </p>
                                    </div>

                                    {/* Analytics Cookies */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    Analytics Cookies
                                                </h4>
                                            </div>
                                            <button
                                                onClick={() => togglePreference('analytics')}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.analytics ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 ml-8">
                                            These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                                        </p>
                                    </div>

                                    {/* Functional Cookies */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    Functional Cookies
                                                </h4>
                                            </div>
                                            <button
                                                onClick={() => togglePreference('functional')}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.functional ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.functional ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 ml-8">
                                            These cookies enable enhanced functionality and personalization, such as language preferences and region selection.
                                        </p>
                                    </div>

                                    {/* Marketing Cookies */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <Cookie className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    Marketing Cookies
                                                </h4>
                                            </div>
                                            <button
                                                onClick={() => togglePreference('marketing')}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.marketing ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 ml-8">
                                            These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={savePreferences}
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg shadow-blue-600/30"
                                    >
                                        Save Preferences
                                    </button>
                                    <button
                                        onClick={acceptAll}
                                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors duration-200"
                                    >
                                        Accept All
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
        </>
    );
}
