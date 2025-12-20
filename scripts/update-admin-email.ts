import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function updateAdminEmail() {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })

    const oldEmail = 'cenk@voon.fi'
    const newEmail = 'info@voon.fi'
    const userId = '0e2bc387-0345-4083-b470-882b2214af92'

    console.log(`Updating admin email from ${oldEmail} to ${newEmail}...\n`)

    // 1. Update email in Supabase Auth
    console.log('Step 1: Updating email in Supabase Auth...')
    const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        { email: newEmail }
    )

    if (authError) {
        console.error('❌ Error updating email in Supabase Auth:', authError)
        return
    }

    console.log('✅ Email updated in Supabase Auth')

    // 2. Update email in public.users table
    console.log('\nStep 2: Updating email in public.users table...')
    const { data: userData, error: userError } = await supabase
        .from('users')
        .update({ email: newEmail })
        .eq('id', userId)
        .select()
        .single()

    if (userError) {
        console.error('❌ Error updating email in public.users:', userError)
        return
    }

    console.log('✅ Email updated in public.users table')

    // 3. Verify the update
    console.log('\nStep 3: Verifying the update...')
    const { data: verifyUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

    console.log('\n✅ Update successful!')
    console.log('\nUpdated user details:')
    console.log(`  Email: ${verifyUser?.email}`)
    console.log(`  Name: ${verifyUser?.name}`)
    console.log(`  Role: ${verifyUser?.role}`)
    console.log(`  ID: ${verifyUser?.id}`)

    console.log('\n🔐 New login credentials:')
    console.log(`  Email: ${newEmail}`)
    console.log(`  Password: Cenk2025! (unchanged)`)
}

updateAdminEmail().catch(console.error)
