import { prisma } from "../src/lib/prisma";
import bcrypt from "bcrypt"

async function main() {

    const userId = "5d6863bd-beec-4e07-bf4f-a39098d1da97"    
    const password = "password" // for dev purposes
    const passwordHash = bcrypt.hashSync(password, 10);
    
    await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: "kylewillett@email.com",
            password: passwordHash,
            name: "Kyle Willett",
            roles: ["admin", "user"]
        }
    })
    
    const ctgId = {
        groceries: "1e573b8b-f9a1-4d53-8f43-577301561d1c",
        dining: "eea856f3-32e9-48d2-b1ea-1469f67eca2f",
        transport: "289b9f01-8e75-4b39-869d-031742881232",
        housing: "8928ecfb-6c44-4cd9-9eef-7fef36aada9b",
        utilities: "8eba051e-9286-4ad1-aa65-0f7147a389fa",
        subscriptions: "9da90c9b-3b5a-4a14-9796-6bbf3ce475eb",
        shopping: "8214fdf1-32b3-4943-a13f-93ade296499e",
        health: "1a41eeb7-1195-41a5-bde1-006ecd37d670",
        entertainment: "5b24acad-3a69-4a0f-8c4b-849cbeb6f2ea",
        travel: "839f54ad-6e36-44cf-982a-e0bd5afe0453",
        salary: "e518d8e4-0166-498f-a954-7c2f3914081a",
        freelance: "f734f5ec-fd8c-4e82-a243-e73d2e1a5200",
        transfer: "34bfb26b-25cc-4ddd-bcb4-26d3be5f16ff"
    }
    
    await prisma.category.createMany({
        data: [
            { id: ctgId.groceries, name: "Groceries", hue: 145, kind: "expense" },
            { id: ctgId.dining, name: "Dining", hue: 30, kind: "expense" },
            { id: ctgId.transport, name: "Transport", hue: 250, kind: "expense" },
            { id: ctgId.housing, name: "Rent & Housing", hue: 305, kind: "expense" },
            { id: ctgId.utilities, name: "Utilities", hue: 220, kind: "expense" },            
            { id: ctgId.subscriptions, name: "Subscriptions", hue: 280, kind: "expense" },            
            { id: ctgId.shopping, name: "Shopping", hue: 350, kind: "expense" },
            { id: ctgId.health, name: "Health", hue: 165, kind: "expense" },
            { id: ctgId.entertainment, name: "Entertainment", hue: 50, kind: "expense" },
            { id: ctgId.travel, name: "Travel", hue: 200, kind: "expense" },
            { id: ctgId.salary, name: "Salary", hue: 185, kind: "income" },
            { id: ctgId.freelance, name: "Freelance", hue: 175, kind: "income" },
            { id: ctgId.transfer, name: "Transfer", hue: 0, kind: "transfer" },
        ],
        skipDuplicates: true
    })

    await prisma.budget.createMany({
        data: [
            { id: "7c5a76f3-b98a-4c8a-9e4d-45ff2d9d79ad", categoryId: ctgId.housing, userId: userId,       limit: 2200, rollover: false },
            { id: "735ceeb4-09a1-40b8-a112-fe3a67ff0510", categoryId: ctgId.groceries, userId: userId,     limit: 600,  rollover: true  },
            { id: "8e7ef98d-c040-4050-9ce4-587897f5321a", categoryId: ctgId.dining, userId: userId,        limit: 250,  rollover: false },
            { id: "464cf5b4-f4e2-4640-a75b-4d0febb2b343", categoryId: ctgId.transport, userId: userId,     limit: 180,  rollover: false },
            { id: "0fa9c69c-e20c-4515-91fb-ba06ece916c9", categoryId: ctgId.utilities, userId: userId,     limit: 220,  rollover: false },
            { id: "fa41524a-5811-4a2d-b4d8-60492298078d", categoryId: ctgId.subscriptions, userId: userId, limit: 220,  rollover: false },
            { id: "0cd4f235-1a9a-4fa4-abf1-c3766c91f2e9", categoryId: ctgId.shopping, userId: userId,      limit: 200,  rollover: true  },
            { id: "1af2b733-28ca-4169-b79b-f7e579570158", categoryId: ctgId.health, userId: userId,        limit: 280,  rollover: false },
            { id: "4ccd0de1-ecc3-409b-93a8-99a152d8fb71", categoryId: ctgId.entertainment, userId: userId, limit: 120,  rollover: true  },
            { id: "0b731a3a-3147-45ac-9668-2ac976cea57d", categoryId: ctgId.travel, userId: userId,        limit: 400,  rollover: true  },    
        ],
        skipDuplicates: true
    })

    const minusDays = (n: number) => {
        const d = new Date();
        d.setDate(28) // set "today" to near end of current month
        d.setDate(d.getDate() - n);
        return d.toISOString().slice(0, 10);
    };

    await prisma.transaction.createMany({
        data: [
            { id: '6443e917-055a-4ebd-9eac-06aff4f90fe4', userId: userId, date: minusDays(0),  merchant: 'Whole Foods Market',  note: 'Weekly grocery run',           amount: -84.32,   categoryId: ctgId.groceries,     account: 'crd', kind: 'expense' },
            { id: '89f1ac66-6387-4b52-a00e-1a5fc4967cbc', userId: userId, date: minusDays(0),  merchant: 'Blue Bottle Coffee',  note: 'Cortado + pastry',             amount: -8.75,    categoryId: ctgId.dining,        account: 'crd', kind: 'expense' },
            { id: 'f36f2c43-2303-4218-91d0-412846b6a0de', userId: userId, date: minusDays(1),  merchant: 'Lyft',                note: 'Ride to airport',              amount: -42.10,   categoryId: ctgId.transport,     account: 'crd', kind: 'expense' },
            { id: '0442153a-895d-486b-995c-9587239e56f2', userId: userId, date: minusDays(1),  merchant: 'Delta Airlines',      note: 'JFK → SFO',                    amount: -312.40,  categoryId: ctgId.travel,        account: 'crd', kind: 'expense' },
            { id: 'b028a95e-f7c7-4523-bb19-854f2f373918', userId: userId, date: minusDays(2),  merchant: 'Spotify',             note: 'Family plan',                  amount: -16.99,   categoryId: ctgId.subscriptions, account: 'chk', kind: 'expense' },
            { id: '30af4c68-7577-4c27-95a6-f55d7db293b3', userId: userId, date: minusDays(2),  merchant: 'Trader Joe\u2019s',   note: '',                             amount: -52.18,   categoryId: ctgId.groceries,     account: 'crd', kind: 'expense' },
            { id: '88e1483f-a41b-4244-a8fb-ba0d35cf8d67', userId: userId, date: minusDays(3),  merchant: 'Stripe Payouts',      note: 'Project — Acme redesign',      amount:  4280.00, categoryId: ctgId.freelance,     account: 'chk', kind: 'income'  },
            { id: 'e831ca68-1746-4210-bc78-dc7820e6eff8', userId: userId, date: minusDays(3),  merchant: 'Uniqlo',              note: 'Linen shirt, basics',          amount: -94.50,   categoryId: ctgId.shopping,      account: 'crd', kind: 'expense' },
            { id: '5d1dde38-2cdc-4de7-85fd-7bd157dca345', userId: userId, date: minusDays(4),  merchant: 'Pacific Gas & Electric', note: 'Utilities bill',            amount: -118.42,  categoryId: ctgId.utilities,     account: 'chk', kind: 'expense' },
            { id: 'beada9e6-e6c1-4903-acf5-1591073b4dd1', userId: userId, date: minusDays(5),  merchant: 'Tartine Bakery',      note: 'Brunch w/ Maya',               amount: -38.20,   categoryId: ctgId.dining,        account: 'crd', kind: 'expense' },
            { id: '6c44b7b2-8ef8-4f0d-b2f1-dbc66bc346dd', userId: userId, date: minusDays(6),  merchant: 'Apple',               note: 'iCloud storage',               amount: -2.99,    categoryId: ctgId.subscriptions, account: 'chk', kind: 'expense' },
            { id: '1e5d331a-5c58-4b3b-8de1-e541a8a2f9e1', userId: userId, date: minusDays(7),  merchant: 'Equinox',             note: 'May membership',               amount: -245.00,  categoryId: ctgId.health,        account: 'crd', kind: 'expense' },
            { id: 'f81fcc29-4358-4352-8aa7-574cad7f94a0', userId: userId, date: minusDays(8),  merchant: 'Greenhouse Studios',  note: 'Bi-weekly payroll',            amount:  3850.00, categoryId: ctgId.salary,        account: 'chk', kind: 'income'  },
            { id: '251e5fcb-a08f-458d-8b47-d0395095ed42', userId: userId, date: minusDays(9),  merchant: 'Amazon',              note: 'Desk lamp, books',             amount: -68.43,   categoryId: ctgId.shopping,      account: 'crd', kind: 'expense' },
            { id: '6c6f7e1b-1b2c-4f49-9ee7-4c9e8ea5569c', userId: userId, date: minusDays(10), merchant: 'Chevron',             note: 'Fill up',                      amount: -54.20,   categoryId: ctgId.transport,     account: 'crd', kind: 'expense' },
            { id: '87f81437-e715-4a9a-b95d-cd276322f141', userId: userId, date: minusDays(11), merchant: 'Greenleaf Properties',note: 'May rent',                     amount: -2200.00, categoryId: ctgId.housing,          account: 'chk', kind: 'expense' },
            { id: 'a854260c-3851-4e83-b9ad-28dd7a635bac', userId: userId, date: minusDays(13), merchant: 'Alamo Drafthouse',    note: 'Movie + drinks',               amount: -46.80,   categoryId: ctgId.entertainment, account: 'crd', kind: 'expense' },
            { id: '45d7087d-e618-4a2f-b8b8-81ac913b2d2e', userId: userId, date: minusDays(14), merchant: 'Comcast Xfinity',     note: 'Internet',                     amount: -89.99,   categoryId: ctgId.utilities,     account: 'chk', kind: 'expense' },
            { id: 'c2ff8ce8-81ed-4693-be42-6ac19abffb44', userId: userId, date: minusDays(15), merchant: 'Costco',              note: 'Bulk staples',                 amount: -187.62,  categoryId: ctgId.groceries,     account: 'crd', kind: 'expense' },
            { id: 'cb1dea1f-66ed-4978-aefa-95436434b9bc', userId: userId, date: minusDays(16), merchant: 'Figma',               note: 'Annual seat',                  amount: -180.00,  categoryId: ctgId.subscriptions, account: 'chk', kind: 'expense' },
            { id: '5504bff9-c7cc-4505-b7d0-2484feb3e6fc', userId: userId, date: minusDays(18), merchant: 'BART',                note: 'Clipper top-up',               amount: -40.00,   categoryId: ctgId.transport,     account: 'chk', kind: 'expense' },
            { id: '659c5914-c669-4f0b-9acc-8fd83b62a883', userId: userId, date: minusDays(20), merchant: 'Sake Bar Hagi',       note: 'Dinner — birthday',            amount: -128.40,  categoryId: ctgId.dining,        account: 'crd', kind: 'expense' },
            { id: 'dc87c799-d838-45e7-84e7-73127829c38a', userId: userId, date: minusDays(22), merchant: 'Walgreens',           note: 'Prescriptions',                amount: -24.18,   categoryId: ctgId.health,        account: 'crd', kind: 'expense' },
            { id: '5052e899-6f5b-4142-987b-ffc20511fd34', userId: userId, date: minusDays(24), merchant: 'Transfer to Savings', note: 'Monthly auto-save',            amount: -800.00,  categoryId: ctgId.transfer,      account: 'chk', kind: 'transfer'},
        ],
        skipDuplicates: true
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