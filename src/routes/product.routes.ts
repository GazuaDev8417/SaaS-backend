import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authenticateToken } from "../middleware/auth.js"


const router = Router()


router.use(authenticateToken)


function calculateStatus(stock:number):string{
    if(stock === 0) return 'Inactive'
    if(stock <= 5) return 'Low Stock'

    return 'Active'
}


router.get('/', async(req, res)=>{
    try{
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        })
        res.json(products)
    }catch(e){
        console.log(e)
        res.status(500).json({ message: 'Failed to fetch products' })
    }
})

router.post('/', async(req, res)=>{
    try{
        const { name, category, description, price, stock } = req.body
        
        if (!name || !category || !description || price === undefined || stock === undefined) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const status = calculateStatus(Number(stock))
        const product = await prisma.product.create({
            data: {
                name,
                category,
                description,
                price: Number(price),
                stock: Number(stock),
                status,
            }
        })

        res.status(201).json(product)
    }catch(e){
        res.status(500).json({ message: 'Failed to create product' })
    }
})


router.put('/:id', async(req, res)=>{
    try{
        const id = Number(req.params.id)
        const { name, category, price, stock } = req.body
        const status = calculateStatus(Number(stock))

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                category,
                price: Number(price),
                stock: Number(stock),
                status,
            }
        })

        res.json(updatedProduct)
    }catch(e){
        res.status(500).json({ message: "Failed to update product" })
    }
})


router.delete('/:id', async(req, res)=>{
    try{
        const id = Number(req.params.id)
        await prisma.product.delete({ where: { id } })

        res.json({ message: 'Product deleted successfully' })
    }catch(e){
        res.status(500).json({ message: 'Failed to delete product' })
    }
})


export default router