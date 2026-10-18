// Shared (client + server) description of the AI tools. Labels live in
// messages/*.json under "Tools.<slug>", prompts live server-side in tool-prompts.ts.

export type ToolCategory = 'sales' | 'marketing' | 'people' | 'operations' | 'finance' | 'legal'

export interface ToolField {
    id: string
    type: 'text' | 'textarea' | 'select'
    required?: boolean
    options?: string[]
    rows?: number
    maxLength?: number
}

export interface ToolDefinition {
    slug: string
    category: ToolCategory
    fields: ToolField[]
}

export const TOOL_CATEGORIES: ToolCategory[] = ['sales', 'marketing', 'people', 'operations', 'finance', 'legal']

export const TOOLS: ToolDefinition[] = [
    {
        slug: 'quote',
        category: 'sales',
        fields: [
            { id: 'customer', type: 'text', required: true, maxLength: 200 },
            { id: 'scope', type: 'textarea', required: true, rows: 5, maxLength: 4000 },
            { id: 'price', type: 'text', maxLength: 300 },
            { id: 'tone', type: 'select', options: ['formal', 'friendly'] },
        ],
    },
    {
        slug: 'email',
        category: 'sales',
        fields: [
            { id: 'situation', type: 'select', required: true, options: ['reply', 'followUp', 'outreach', 'complaint', 'paymentReminder'] },
            { id: 'context', type: 'textarea', required: true, rows: 6, maxLength: 6000 },
            { id: 'tone', type: 'select', options: ['formal', 'friendly'] },
        ],
    },
    {
        slug: 'social',
        category: 'marketing',
        fields: [
            { id: 'topic', type: 'textarea', required: true, rows: 4, maxLength: 3000 },
            { id: 'platform', type: 'select', required: true, options: ['linkedin', 'instagram', 'facebook', 'newsletter'] },
            { id: 'goal', type: 'text', maxLength: 300 },
        ],
    },
    {
        slug: 'feedback',
        category: 'marketing',
        fields: [
            { id: 'reviews', type: 'textarea', required: true, rows: 10, maxLength: 12000 },
        ],
    },
    {
        slug: 'jobad',
        category: 'people',
        fields: [
            { id: 'role', type: 'text', required: true, maxLength: 200 },
            { id: 'details', type: 'textarea', required: true, rows: 6, maxLength: 4000 },
            { id: 'employment', type: 'select', options: ['fullTime', 'partTime', 'fixedTerm', 'internship'] },
        ],
    },
    {
        slug: 'meeting',
        category: 'operations',
        fields: [
            { id: 'notes', type: 'textarea', required: true, rows: 12, maxLength: 15000 },
        ],
    },
    {
        slug: 'automation',
        category: 'operations',
        fields: [
            { id: 'process', type: 'textarea', required: true, rows: 6, maxLength: 5000 },
            { id: 'tools', type: 'text', maxLength: 500 },
            { id: 'volume', type: 'text', maxLength: 300 },
        ],
    },
    {
        slug: 'funding',
        category: 'finance',
        fields: [
            { id: 'project', type: 'textarea', required: true, rows: 6, maxLength: 5000 },
            { id: 'stage', type: 'select', required: true, options: ['startup', 'growth', 'established'] },
            { id: 'employees', type: 'select', options: ['1-9', '10-49', '50-249', '250+'] },
        ],
    },
    {
        slug: 'contract',
        category: 'legal',
        fields: [
            { id: 'document', type: 'textarea', required: true, rows: 12, maxLength: 20000 },
            { id: 'focus', type: 'text', maxLength: 500 },
        ],
    },
    {
        slug: 'aiact',
        category: 'legal',
        fields: [
            { id: 'useCase', type: 'textarea', required: true, rows: 6, maxLength: 5000 },
            { id: 'data', type: 'text', maxLength: 500 },
        ],
    },
]

export function getTool(slug: string): ToolDefinition | undefined {
    return TOOLS.find((tool) => tool.slug === slug)
}
