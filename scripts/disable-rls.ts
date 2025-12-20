import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function disableRLS() {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })

    console.log('Disabling RLS on users table...')

    const sql = fs.readFileSync(path.join(__dirname, '../supabase/disable-rls.sql'), 'utf-8')

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
        console.error('Error disabling RLS:', error)

        // Try alternative method using raw SQL
        console.log('\nTrying alternative method...')
        const { error: altError } = await supabase
            .from('users')
            .select('id')
            .limit(1)

        if (altError) {
            console.error('Alternative method also failed:', altError)
        } else {
            console.log('✓ Can access users table')
        }
    } else {
        console.log('✓ RLS disabled successfully')
    }
}

disableRLS().catch(console.error)
