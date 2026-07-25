import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
    await prisma.order.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    const rawPassword = 'password123';
    const hashedPassword = bcrypt.hashSync(rawPassword.trim(), 10);
    await prisma.user.create({
        data: {
            name: "Flamarion França",
            email: "admin@example.com",
            password: hashedPassword,
            role: "Fullstack Developer",
            emailNotifs: true,
            pushNotifs: false,
            marketingEmails: false,
        }
    });
    await prisma.product.createMany({
        data: [
            { name: "MacBook Pro", category: "Electronics", price: 2499, stock: 15, status: "Active" },
            { name: "iPhone 16", category: "Electronics", price: 999, stock: 42, status: "Active" },
            { name: "AirPods Pro", category: "Accessories", price: 249, stock: 6, status: "Low Stock" },
            { name: "Magic Mouse", category: "Accessories", price: 99, stock: 0, status: "Inactive" },
        ]
    });
    const customer1 = await prisma.customer.create({
        data: { name: "John Smith", email: "john@example.com", phone: "+1 (555) 123-4567", status: "Active" }
    });
    const customer2 = await prisma.customer.create({
        data: { name: "Emma Wilson", email: "emma@example.com", phone: "+1 (555) 987-6543", status: "Active" },
    });
    await prisma.order.createMany({
        data: [
            { product: "Premium Plan", total: 120, status: "completed", customerId: customer1.id },
            { product: "Starter Plan", total: 49, status: "pending", customerId: customer2.id },
        ]
    });
    console.log('Seed completed successfully');
}
main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map