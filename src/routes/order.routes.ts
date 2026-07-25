import { Router } from "express"
import { authenticateToken } from "../middleware/auth.js"


const router = Router()


router.use(authenticateToken)


router.get("/recent", (req, res) => {
  const recentOrders = [
    { id: 1, customer: "John Smith", product: "Premium Plan", total: "$120", status: "completed" },
    { id: 2, customer: "Emma Wilson", product: "Starter Plan", total: "$49", status: "pending" },
    { id: 3, customer: "Michael Brown", product: "Business Plan", total: "$299", status: "completed" },
    { id: 4, customer: "Sophia Davis", product: "Enterprise Plan", total: "$599", status: "pending" },
  ]
  res.json(recentOrders)
})


router.get("/by-month", (req, res) => {
  const ordersByMonth = [
    { month: "Jan", orders: 45 },
    { month: "Feb", orders: 52 },
    { month: "Mar", orders: 61 },
    { month: "Apr", orders: 58 },
    { month: "May", orders: 75 },
    { month: "Jun", orders: 90 },
  ]
  res.json(ordersByMonth)
})


export default router