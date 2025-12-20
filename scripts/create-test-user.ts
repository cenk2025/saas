import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

console.log('Environment check:')
console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ Set' : '✗ Missing')
console.log('')

async function createTestUser() {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })

    const email = 'cenk@voon.fi'
    const password = 'Cenk2025!'

    console.log('Creating user with Supabase Auth...')

    // First, delete existing user if any
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users.find(u => u.email === email)

    if (existingUser) {
        console.log(`Deleting existing user: ${existingUser.id}`)
        await supabase.auth.admin.deleteUser(existingUser.id)

        // Also delete from public.users table
        await supabase.from('users').delete().eq('id', existingUser.id)
    }

    // Create new user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
            name: 'Cenk'
        }
    })

    if (authError) {
        console.error('Error creating user in Supabase Auth:', authError)
        return
    }

    console.log('User created in Supabase Auth:', authData.user.id)

    // Create user in public.users table
    const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
            id: authData.user.id,
            email,
            name: 'Cenk',
            role: 'ADMIN'
        })
        .select()
        .single()

    if (userError) {
        console.error('Error creating user in public.users:', userError)
        return
    }

    console.log('User created in public.users table:', userData)

    // Test login
    console.log('\nTesting login...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (loginError) {
        console.error('Login failed:', loginError)
    } else {
        console.log('Login successful!', loginData.user.id)
    }
}

createTestUser().catch(console.error)
