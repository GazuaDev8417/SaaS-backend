import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authenticateToken } from "../middleware/auth.js"


const router = Router()

router.use(authenticateToken)


router.get('/revenue', async(req, res)=>{
    try {
        const revenueOverview = await prisma.revenue.findMany()

        res.json(revenueOverview)
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