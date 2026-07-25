import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from './routes/auth.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.routes.js'
import customerRoutes from './routes/customer.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'
import settingsRoutes from './routes/settings.router.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/settings', settingsRoutes)

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 S/erver running on http://localhost:${PORT}`)
})