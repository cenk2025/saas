import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { companyName, fullName, email, password, country, phone } = body

        // Validate required fields
        if (!companyName || !fullName || !email || !password || !country) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Create Supabase client with service role key
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        // 1. Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email for now
            user_metadata: {
                full_name: fullName
            }
        })

        if (authError) {
            console.error("Auth error:", authError)
            return NextResponse.json(
                { error: authError.message || "Failed to create user" },
                { status: 400 }
            )
        }

        // 2. Create company in companies table
        const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .insert({
                name: companyName,
                country: country
            })
            .select()
            .single()

        if (companyError) {
            // Rollback: delete the auth user
            await supabase.auth.admin.deleteUser(authData.user.id)
            console.error("Company creation error:", companyError)
            return NextResponse.json(
                { error: "Failed to create company" },
                { status: 500 }
            )
        }

        // 3. Create user in public.users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email,
                name: fullName,
                role: 'ADMIN', // First user of company is admin
                company_id: companyData.id
            })
            .select()
            .single()

        if (userError) {
            // Rollback: delete company and auth user
            await supabase.from('companies').delete().eq('id', companyData.id)
            await supabase.auth.admin.deleteUser(authData.user.id)
            console.error("User creation error:", userError)
            return NextResponse.json(
                { error: "Failed to create user profile" },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            user: {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                company_id: userData.company_id
            }
        })

    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        )
    }
}
