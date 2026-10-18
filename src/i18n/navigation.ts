import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const locales = ['fi', 'sv', 'en'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
    locales,
    defaultLocale: 'fi'
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
