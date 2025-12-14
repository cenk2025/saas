
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'manager1@corpA.com' },
        include: { company: true }
    })

    if (!user || !user.companyId) {
        console.error("User or company not found")
        return
    }

    await prisma.diagnosticReport.create({
        data: {
            companyId: user.companyId,
            score: 78,
            summary: "The company demonstrates strong operational foundations but requires significant investment in digital transformation and innovation frameworks to remain competitive.",
            recommendations: [
                "Implement a cloud-first strategy to modernize legacy systems.",
                "Establish an innovation lab with a dedicated budget.",
                "Conduct quarterly cybersecurity audits."
            ],
            weaknesses: [
                "Legacy IT infrastructure",
                "Low R&D investment",
                "Manual compliance processes"
            ],
            categoryScores: {
                "Operational Efficiency": 85,
                "Digital Maturity": 45,
                "Innovation Capability": 30,
                "Financial Health": 90,
                "Risk Management": 65
            },
            rawAnswers: {},
            aiResponse: {}
        }
    })

    console.log("Report created successfully")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
