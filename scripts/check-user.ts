import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkUser() {
    const { data, error } = await supabase
        .from('users')
        .select('id, email, name, company_id')
        .eq('email', 'info@voon.fi')
        .single()

    console.log('User data:', JSON.stringify(data, null, 2))
    console.log('Error:', error)
}

checkUser()
