import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function listUsers() {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })

    console.log('Listing all users in Supabase Auth...\n')

    const { data, error } = await supabase.auth.admin.listUsers()

    if (error) {
        console.error('Error listing users:', error)
        return
    }

    console.log(`Found ${data.users.length} users:\n`)

    data.users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`)
        console.log(`   ID: ${user.id}`)
        console.log(`   Created: ${user.created_at}`)
        console.log(`   Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)
        console.log(`   Last Sign In: ${user.last_sign_in_at || 'Never'}`)
        console.log('')
    })

    // Also check public.users table
    console.log('\nChecking public.users table...\n')

    const { data: publicUsers, error: publicError } = await supabase
        .from('users')
        .select('*')

    if (publicError) {
        console.error('Error reading public.users:', publicError)
    } else {
        console.log(`Found ${publicUsers.length} users in public.users table:\n`)
        publicUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.email}`)
            console.log(`   ID: ${user.id}`)
            console.log(`   Name: ${user.name}`)
            console.log(`   Role: ${user.role}`)
            console.log('')
        })
    }
}

listUsers().catch(console.error)
