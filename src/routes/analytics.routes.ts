import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authenticateToken } from "../middleware/auth.js"


const router = Router()

router.use(authenticateToken)

/* router.get('/overview', authenticateToken, async(req, res)=>{
    try{
        const totalProducts = await prisma.product.count()
        const totalCustomers = await prisma.customer.count()

        const orders = await prisma.order.findMany()
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

        const activeProducts = await prisma.product.count({
            where: { status: 'Active' }
        })

        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                customer: {
                    select: { name: true, email: true }
                }
            }
        })

        res.json({
            totalRevenue,
            totalCustomers,
            totalProducts,
            activeProducts,
            recentOrders
        })
    }catch(e){
        res.status(500).json({ message: "Failed to fetch dashboard metrics" })
    }
}) */


router.get('/revenue', async(req, res)=>{
    try {
        // Monthly sales data format expected by frontend charts
        const revenueOverview = [
        { month: "Jan", revenue: 4000, orders: 240 },
        { month: "Feb", revenue: 3000, orders: 198 },
        { month: "Mar", revenue: 5000, orders: 300 },
        { month: "Apr", revenue: 2780, orders: 190 },
        { month: "May", revenue: 1890, orders: 120 },
        { month: "Jun", revenue: 2390, orders: 170 },
        ]

        res.json(revenueOverview)
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch revenue data" })
    }
})


router.get('/categories', async(req, res)=>{
    try {
        const productCategories = [
            { name: "Electronics", value: 40 },
            { name: "Accessories", value: 25 },
            { name: "Software", value: 20 },
            { name: "Services", value: 15 },
        ]

        res.json(productCategories)
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch categories data" })
    }
})

export default router