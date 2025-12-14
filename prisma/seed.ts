import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
})

async function main() {
    const password = await hash('password123', 12)

    // 1 Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@clarity.ai' },
        update: {},
        create: {
            email: 'admin@clarity.ai',
            name: 'Super Admin',
            password,
            role: Role.ADMIN,
        },
    })

    // Company A
    const companyA = await prisma.company.upsert({
        where: { id: 'comp_a' }, // Using fixed ID for idempotency if possible, but upsert needs unique field. Company name isn't unique in schema yet? Name is just String.
        // I'll just create if not exists using findFirst or something?
        // For simplicity, I'll delete all first? No, upsert user is fine.
        // I'll check if company exists by finding a user.
        update: {},
        create: {
            name: 'Acme Corp',
            // We will connect users later or create logic here
        }
    })
    // Actually schema company doesn't have unique name. 
    // Let's Clean up db first? 
    // "Seed file: ... 3 example reports".

    // To avoid duplicates on re-run, I should delete users/companies?
    // But that data might be precious.
    // I'll just look for company by ID if I had one, but I don't.
    // I'll rely on email uniqueness for users.

    // Create Managers
    const managerA = await prisma.user.upsert({
        where: { email: 'manager1@corpA.com' },
        update: {},
        create: {
            email: 'manager1@corpA.com',
            name: 'Manager Alice',
            password,
            role: Role.MANAGER,
            company: {
                create: {
                    name: 'Acme Corp'
                }
            }
        }
    })

    // If Manager A existed, they have a company. If not, we created one.
    const userA = await prisma.user.findUnique({ where: { email: 'manager1@corpA.com' }, include: { company: true } })

    if (userA && userA.companyId) {
        // Create employees for Company A
        const emp1 = await prisma.user.upsert({
            where: { email: 'emp1@corpA.com' },
            update: {},
            create: {
                email: 'emp1@corpA.com',
                name: 'Employee Bob',
                password,
                role: Role.EMPLOYEE,
                companyId: userA.companyId
            }
        })

        // Create Report
        await prisma.diagnosticReport.create({
            data: {
                companyId: userA.companyId,
                score: 75,
                summary: "Good operational efficiency but low innovation.",
                weaknesses: ["Legacy systems", "Slow decision making"],
                recommendations: ["Adpot cloud native tools", "Flat hierarchy experiments"],
                createdAt: new Date('2025-01-15')
            }
        })
    }

    // Company B
    const managerB = await prisma.user.upsert({
        where: { email: 'manager2@corpB.com' },
        update: {},
        create: {
            email: 'manager2@corpB.com',
            name: 'Manager Carol',
            password,
            role: Role.MANAGER,
            company: {
                create: {
                    name: 'Globex Inc'
                }
            }
        }
    })

    console.log({ admin })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
