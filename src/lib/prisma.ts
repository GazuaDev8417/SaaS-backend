import { PrismaClient as DashboardClient } from '@prisma/client'
import { PrismaClient as DeliveryClient } from '@prisma/client'



const globalForPrisma = globalThis as unknown as {
    dashboardPrisma: DashboardClient | undefined
    deliveryPrisma: DeliveryClient | undefined
}

export const prisma = globalForPrisma.dashboardPrisma ?? new DashboardClient()
export const deliveryPrisma = globalForPrisma.deliveryPrisma ?? new DeliveryClient()

if(process.env.NODE_ENV !== 'production'){
    globalForPrisma.dashboardPrisma = prisma
    globalForPrisma.deliveryPrisma = deliveryPrisma
}