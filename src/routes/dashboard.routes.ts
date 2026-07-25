import { Router } from "express"
import { authenticateToken } from "../middleware/auth.js"


const router = Router()


router.use(authenticateToken)



router.get('/statistics', async(req, res)=>{
    const statistics = [
        { title: 'Revenue', value: '$4, 500' },
        { title: 'Customer', value: '1,245' },
        { title: 'Orders', value: '325' },
        { title: 'Products', value: '98' }
    ]
    res.json(statistics)
})


export default router