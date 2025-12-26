import { prisma } from "../lib/prisma";

async function main() {
    const user = await prisma.user.findFirst();
    console.log("User ID:", user?.id);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
