import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function fixAdminUser() {
    // 1. Create a company for Voon
    console.log('Creating Voon company...')
    const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
            name: 'Voon',
            country: 'FI'
        })
        .select()
        .single()

    if (companyError) {
        console.error('Company creation error:', companyError)
        return
    }

    console.log('✅ Company created:', company.id)

    // 2. Update info@voon.fi user with company_id
    console.log('\nUpdating info@voon.fi user...')
    const { data: user, error: userError } = await supabase
        .from('users')
        .update({ company_id: company.id })
        .eq('email', 'info@voon.fi')
        .select()
        .single()

    if (userError) {
        console.error('User update error:', userError)
        return
    }

    console.log('✅ User updated:', user)
}

fixAdminUser()
