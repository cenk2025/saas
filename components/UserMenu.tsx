"use client"

import { signOut } from "next-auth/react"
import type { User } from "next-auth"
import { Role } from "@prisma/client"

interface UserMenuProps {
    user: {
        name?: string | null
        email?: string | null
        role: Role
    }
}

export function UserMenu({ user }: UserMenuProps) {
    return (
        <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">{user.name || user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">{user.role}</p>
            </div>
            <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium text-destructive hover:bg-destructive/10 px-3 py-2 rounded-md transition-colors"
            >
                Logout
            </button>
        </div>
    )
}
