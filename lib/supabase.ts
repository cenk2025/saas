import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
                    company_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    name?: string | null
                    role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
                    company_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string | null
                    role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
                    company_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            companies: {
                Row: {
                    id: string
                    name: string
                    country: string | null
                    stripe_customer_id: string | null
                    stripe_subscription_id: string | null
                    stripe_price_id: string | null
                    stripe_current_period_end: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    country?: string | null
                    stripe_customer_id?: string | null
                    stripe_subscription_id?: string | null
                    stripe_price_id?: string | null
                    stripe_current_period_end?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    country?: string | null
                    stripe_customer_id?: string | null
                    stripe_subscription_id?: string | null
                    stripe_price_id?: string | null
                    stripe_current_period_end?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            diagnostic_reports: {
                Row: {
                    id: string
                    company_id: string
                    user_id: string | null
                    score: number
                    summary: string
                    weaknesses: string[]
                    recommendations: string[]
                    raw_answers: any | null
                    ai_response: any | null
                    category_scores: any | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    company_id: string
                    user_id?: string | null
                    score: number
                    summary: string
                    weaknesses: string[]
                    recommendations: string[]
                    raw_answers?: any | null
                    ai_response?: any | null
                    category_scores?: any | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    company_id?: string
                    user_id?: string | null
                    score?: number
                    summary?: string
                    weaknesses?: string[]
                    recommendations?: string[]
                    raw_answers?: any | null
                    ai_response?: any | null
                    category_scores?: any | null
                    created_at?: string
                }
            }
        }
    }
}
