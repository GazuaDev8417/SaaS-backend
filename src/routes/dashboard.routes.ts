import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authenticateToken } from "../middleware/auth.js"


const router = Router()


router.use(authenticateToken)



router.get('/statistics', async(req, res)=>{
    try{
        const statistics = await prisma.statistics.findMany()

        res.json(statistics)
    }catch(e){
        res.status(500).json({ message: 'Failed to fetch statistics' })
    }
})


export default router