import type { PrismaClient } from "@prisma/client/extension";
import { Prisma } from "../../generated/prisma/client.ts";

export default function seedData(prisma: PrismaClient) {

    function seedUser(): Promise<boolean> {
        return prisma.user.create({
            data: {
                id: "5d6863bd-beec-4e07-bf4f-a39098d1da97",
                email: "kylewillett@email.com",
                name: "Kyle Willett"
            }
        }).then((_: any) => true).catch((error: any) => {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {  
                // P2002 Unique constraint failed
                // P2025 record not found
                // P2003 Foreign key constraint failed              
                return true
            } else {
                throw error
            }
        })
    }

    function seedCategories(): Promise<boolean> {
        return prisma.user.createMany({
            data: [
                { id: "1e573b8b-f9a1-4d53-8f43-577301561d1c", name: "Groceries", hue: 145, kind: "expense" },
            ],
            skipDuplicates: true, // Skip records with duplicate unique fields
        })
        
        /* 

        
eea856f3-32e9-48d2-b1ea-1469f67eca2f
289b9f01-8e75-4b39-869d-031742881232
8928ecfb-6c44-4cd9-9eef-7fef36aada9b
8eba051e-9286-4ad1-aa65-0f7147a389fa
9da90c9b-3b5a-4a14-9796-6bbf3ce475eb
8214fdf1-32b3-4943-a13f-93ade296499e
1a41eeb7-1195-41a5-bde1-006ecd37d670
5b24acad-3a69-4a0f-8c4b-849cbeb6f2ea
839f54ad-6e36-44cf-982a-e0bd5afe0453
e518d8e4-0166-498f-a954-7c2f3914081a
f734f5ec-fd8c-4e82-a243-e73d2e1a5200
34bfb26b-25cc-4ddd-bcb4-26d3be5f16ff

export const categories = [
    
    { id: 'dining',        name: 'Dining',        hue: 30,  kind: 'expense' },
    { id: 'transport',     name: 'Transport',     hue: 250, kind: 'expense' },
    { id: 'rent',          name: 'Rent & Housing',hue: 305, kind: 'expense' },
    { id: 'utilities',     name: 'Utilities',     hue: 220, kind: 'expense' },
    { id: 'subscriptions', name: 'Subscriptions', hue: 280, kind: 'expense' },
    { id: 'shopping',      name: 'Shopping',      hue: 350, kind: 'expense' },
    { id: 'health',        name: 'Health',        hue: 165, kind: 'expense' },
    { id: 'entertainment', name: 'Entertainment', hue: 50,  kind: 'expense' },
    { id: 'travel',        name: 'Travel',        hue: 200, kind: 'expense' },
    { id: 'salary',        name: 'Salary',        hue: 185, kind: 'income'  },
    { id: 'freelance',     name: 'Freelance',     hue: 175, kind: 'income'  },
    { id: 'transfer',      name: 'Transfer',      hue: 0,   kind: 'transfer'},
];


        const createMany = await prisma.user.createMany({
            data: [
                { name: "Bob", email: "bob@prisma.io" },
                { name: "Yewande", email: "yewande@prisma.io" },
            ],
            skipDuplicates: true, // Skip records with duplicate unique fields
        });
        */
    }

    console.log("Seed data: adding...")
    return seedUser().then(_ => {
        console.log("Seed data: user data added...")
        console.log("Seed data: successfully finished")
    }).catch(error => {
        console.error("Adding seed data failed")
        console.log(error)
    })

}