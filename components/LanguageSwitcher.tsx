"use client"

import { usePathname, useRouter } from "next/navigation"

export function LanguageSwitcher() {
    const pathname = usePathname()
    const router = useRouter()

    const currentLocale = pathname.split('/')[1] || 'en'

    const handleCreate = (locale: string) => {
        const newPath = `/${locale}${pathname.substring(3)}`
        router.push(newPath)
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleCreate('en')}
                className={`text-xs font-bold px-2 py-1 rounded ${currentLocale === 'en' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
                EN
            </button>
            <button
                onClick={() => handleCreate('fi')}
                className={`text-xs font-bold px-2 py-1 rounded ${currentLocale === 'fi' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
                FI
            </button>
        </div>
    )
}
