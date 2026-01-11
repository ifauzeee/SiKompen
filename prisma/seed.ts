import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding (Production - Admin Only)...");

    await prisma.payment.deleteMany().catch(() => { });
    await prisma.activityLog.deleteMany().catch(() => { });
    await prisma.jobApplication.deleteMany().catch(() => { });
    await prisma.clearanceRequest.deleteMany().catch(() => { });
    await prisma.job.deleteMany().catch(() => { });
    await prisma.user.deleteMany().catch(() => { });

    const adminPasswordHash = await bcrypt.hash("admin123", 12);

    await prisma.user.create({
        data: {
            username: "admin",
            name: "Administrator",
            nim: null,
            prodi: "Pusat",
            role: "ADMIN",
            totalHours: 0,
            password: adminPasswordHash,
        },
    });

    console.log("Created Admin: admin / admin123");
    console.log("Seeding finished.");
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