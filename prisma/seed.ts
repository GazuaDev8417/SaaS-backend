import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"


const prisma = new PrismaClient()


async function main(){
    await prisma.order.deleteMany()
    await prisma.customer.deleteMany()
    await prisma.product.deleteMany()
    await prisma.user.deleteMany()
    await prisma.revenue.deleteMany()
    await prisma.category.deleteMany()
    await prisma.statistics.deleteMany()

    
    const rawPassword = 'password123'
    const hashedPassword = bcrypt.hashSync(rawPassword.trim(), 10)
    
    await prisma.user.create({
        data: {
            name: "Flamarion França",
            email: "admin@example.com",
            password: hashedPassword,
            role: "Fullstack Developer",
            emailNotifs: true,
            pushNotifs: false,
            marketingEmails: false,
            updatedAt: new Date()
        }
    })

    await prisma.product.createMany({
        data: [
            { name: "Heineken", description: 'The famous Dutch pale lager with 100 % natural ingredients and its iconic green bottle', category: "Beer", price: 7.80, stock: 280, status: "Active" },
            { name: "MacBook Pro", description: `It's a light body, clear golden color, and balanced taste with 330ml bottle size`, category: "Beer", price: 7.00, stock: 100, status: "Low Stock" },
            { name: "Itaipava", description: `Light, refreshing, low-bitterness Pilsner with 4.5% ABV.`, category: "Beer", price: 3.50, stock: 150, status: "Active" },
            { name: "Red Label", description: `The world's best-selling blended Scotch whisky, famous for its vibrant, bold, and spicy flavor profile`, category: "Whisky", price: 150, stock: 0, status: "Inactive" },
            { name: "Churrasco", description: `Popular Brazilian snack made with cubed pieces of meat, chicken, or cheese`, category: "Snack", price: 32.00, stock: 100, status: "Low Stock" },
            { name: "Picanha na brasa", description: `Grilled picanha is the most famous dish of the Brazilian barbecue, known for its thick fat cap, very tender meat, and bold flavor.`, category: "Snack", price: 80.00, stock: 180, status: "Active" },
        ]
    })

    const customer1 = await prisma.customer.create({
        data: { name: "John Smith", email: "john@example.com", phone: "+1 (555) 123-4567", status: "Active" }
    })
    const customer2 = await prisma.customer.create({
        data: { name: "Emma Wilson", email: "emma@example.com", phone: "+1 (555) 987-6543", status: "Active" },
    })
    const customer3 = await prisma.customer.create({
        data: { name: "Michael Brown", email: "michael@example.com", phone: "+1 (555) 786-4477", status: "Active" },
    })
    const customer4 = await prisma.customer.create({
        data: { name: "Sophia Davis", email: "sophia@example.com", phone: "+1 (555) 772-3399", status: "Active" },
    })

    await prisma.order.createMany({
        data: [
            { product: "Premium Plan", total: 120, status: "Completed", customerId: customer1.id, customerName: customer1.name },
            { product: "Starter Plan", total: 49, status: "Pending", customerId: customer2.id, customerName: customer2.name },
            { product: "Premium Plan", total: 120, status: "Completed", customerId: customer3.id, customerName: customer3.name },
            { product: "Starter Plan", total: 49, status: "Pending", customerId: customer4.id, customerName: customer4.name },
            { product: "Business Plan", total: 299, status: "Completed", customerId: customer1.id, customerName: customer1.name },
            { product: "Enterprise Plan", total: 599, status: "Pending", customerId: customer2.id, customerName: customer2.name },
        ]
    })

    /* await prisma.revenue.createMany({
        data: [
            { month: "Jan", revenue: 4000, orders: 240 },
            { month: "Feb", revenue: 3000, orders: 198 },
            { month: "Mar", revenue: 5000, orders: 300 },
            { month: "Apr", revenue: 2780, orders: 190 },
            { month: "May", revenue: 1890, orders: 120 },
            { month: "Jun", revenue: 2390, orders: 170 }
        ]
    })

    await prisma.category.createMany({
        data: [
            { name: "Electronics", value: 40 },
            { name: "Accessories", value: 25 },
            { name: "Software", value: 20 },
            { name: "Services", value: 15 }
        ]
    })

    const customersQuantity = await prisma.customer.count()
    const ordersQuantity = await prisma.order.count()
    const productsQuantity = await prisma.product.count()

    await prisma.statistics.createMany({
        data: [
            { title: 'Revenue', value: 4500 },
            { title: 'Customer', value: customersQuantity },
            { title: 'Orders', value: ordersQuantity },
            { title: 'Products', value: productsQuantity }
        ]
    })*/

    console.log('Seed completed successfully')
}

main().catch(e=>{
    console.error(e)
    process.exit(1)
}).finally(async() =>{
    await prisma.$disconnect()
})