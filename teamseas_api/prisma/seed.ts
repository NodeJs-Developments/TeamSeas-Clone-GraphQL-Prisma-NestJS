import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.donation.deleteMany();
    const anil = await prisma.donation.create({
        data: {
            email: 'anil@prisma.io',
            displayName: 'Anil',
            count: 5
        },
    });

    console.log({ anil});
    
}

main()
    .catch((e)=>{
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });