import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authenticateToken } from "../middleware/auth.js"

const router = Router()

router.use(authenticateToken)


// GET /api/customers - List all customers with their order count & total spend
router.get("/", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: { orders: true },
      orderBy: { createdAt: "desc" },
    })

    res.json(customers)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch customers" })
  }
})

// POST /api/customers - Create new customer
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, status } = req.body

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required fields" })
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        status: status || "Active",
      },
    })

    res.status(201).json(customer)
  } catch (error) {
    res.status(500).json({ message: "Failed to create customer" })
  }
})

// PUT /api/customers/:id - Update customer
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { name, email, phone, status } = req.body

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: { name, email, phone, status },
    })

    res.json(updatedCustomer)
  } catch (error) {
    res.status(500).json({ message: "Failed to update customer" })
  }
})

// DELETE /api/customers/:id - Delete customer
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id)
    await prisma.customer.delete({ where: { id } })
    res.json({ message: "Customer deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete customer" })
  }
})

export default router