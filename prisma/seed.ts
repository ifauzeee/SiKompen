import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding (Admin Only)...");

    await prisma.jobApplication.deleteMany();
    await prisma.clearanceRequest.deleteMany();
    await prisma.job.deleteMany();
    await prisma.user.deleteMany();

    const admin = await prisma.user.create({
        data: {
            email: "admin@pnj.ac.id",
            name: "Administrator PNJ",
            nim: null,
            role: "ADMIN",
            totalHours: 0,
            password: "admin123",
        },
    });

    console.log("Seeding finished.");
    console.log("Created Admin User:", admin.email);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });