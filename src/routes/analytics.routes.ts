import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authenticateToken } from "../middleware/auth.js"


const router = Router()

router.use(authenticateToken)


router.get('/revenue', async(req, res)=>{
    try {
        const [totalCustomers, totalOrder, totalProducts, orderRevenue] = await Promise.all([
            prisma.customer.count(),
            prisma.order.count(),
            prisma.product.count(),
            prisma.order.aggregate({
                _sum: { total: true }
            }),
        ])
        const totalRevenue = orderRevenue._sum.total ?? 0

        return [
            { title: 'Revenue', value: Number(totalRevenue) },
            { title: 'Customer', value: totalCustomers },
            { title: 'Orders', value: totalOrder },
            { title: 'Products', value: totalProducts },
        ]
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch revenue data" })
    }
})


router.get('/categories', async(req, res)=>{
    try {
        const productCategories = await prisma.category.findMany()

        res.json(productCategories)
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch categories data" })
    }
})

export default router