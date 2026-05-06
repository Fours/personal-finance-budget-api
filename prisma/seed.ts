import { prisma } from "../src/lib/prisma";

async function main() {

    await prisma.user.upsert({
        where: { id: "5d6863bd-beec-4e07-bf4f-a39098d1da97" },
        update: {},
        create: {
            id: "5d6863bd-beec-4e07-bf4f-a39098d1da97",
            email: "kylewillett@email.com",
            name: "Kyle Willett"
        }
    })

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