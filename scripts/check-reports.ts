import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkReports() {
    // Get info@voon.fi user
    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'info@voon.fi')
        .single()

    console.log('User:', user)

    if (!user?.company_id) {
        console.log('No company_id!')
        return
    }

    // Get reports for this company
    const { data: reports } = await supabase
        .from('diagnostic_reports')
        .select('*')
        .eq('company_id', user.company_id)
        .order('created_at', { ascending: false })

    console.log('\nReports for company:', user.company_id)
    console.log('Total reports:', reports?.length || 0)

    reports?.forEach((r, i) => {
        console.log(`\n${i + 1}. Report ID: ${r.id}`)
        console.log(`   Score: ${r.score}`)
        console.log(`   Created: ${r.created_at}`)
        console.log(`   Company ID: ${r.company_id}`)
    })
}

checkReports()
