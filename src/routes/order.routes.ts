import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authenticateToken } from "../middleware/auth.js"


const router = Router()


router.use(authenticateToken)


router.get("/recent", async(req, res) => {
  try{
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: twoMonthsAgo }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(recentOrders)
  }catch(e){
    res.status(500).json({ message: 'Failed to fetch recent orders' })
  }
})


router.get("/by-month", async(req, res) => {
  const ordersByMonth = await prisma.$queryRaw`
    SELECT TO_CHAR("createdAt", 'MM') AS month,
    CAST(COUNT(*) AS INTEGER) AS orders
    FROM "Order"
    GROUP BY month
    ORDER BY month DESC;
  `
   /* [
    { month: "Jan", orders: 45 },
    { month: "Feb", orders: 52 },
    { month: "Mar", orders: 61 },
    { month: "Apr", orders: 58 },
    { month: "May", orders: 75 },
    { month: "Jun", orders: 90 },
  ] */
  res.json(ordersByMonth)
})


export default router