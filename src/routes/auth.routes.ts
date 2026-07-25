//REMEMBER YOU DIDN'T CREATE THE ROUTES BEFORE RUN NPX PRISMA DB SEED

import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"
import { authenticateToken, type AuthRequest } from "../middleware/auth.js"


const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'



router.post('/login', async(req, res)=>{
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if(!user){
        return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password.trim(), user.password)
    if(!isValidPassword){
        return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {expiresIn: '7d'})

    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            emailNotifs: user.emailNotifs,
            pushNotifs: user.pushNotifs,
            marketingEmails: user.marketingEmails,
        }
    })
})

router.use(authenticateToken)

router.get('/me', async(req:AuthRequest, res)=>{
    if(!req.userId) return res.status(401).json({ message: 'Unauthorized' })

    const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailNotifs: true,
            pushNotifs: true,
            marketingEmails: true,
        }
    })

    if(!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
})


router.put('/profile', async(req:AuthRequest, res)=>{
    if(!req.userId) return res.status(401).json({ message: 'Unauthoized'} )

    const { name, email, role } = req.body

    try{
        const updateUser = await prisma.user.update({
            where: { id: req.userId },
            data: { name, email, role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailNotifs: true,
                pushNotifs: true,
                marketingEmails: true,
            }
        })
        
        res.json(updateUser)
    }catch(e:any){
       if(e.code === 'P2002'){
            return res.status(400).json({ message: 'Email is already taken' })
       } 
       res.status(500).json({ message: 'Failed to update profile' })
    }
})


router.put('/password', async(req:AuthRequest, res)=>{
    if(!req.userId) return res.status(401).json({ message: 'Unauthorized' })

    const { currentPassword, newPassword } = req.body
    const user = await prisma.user.findUnique({ where: { id: req.userId } })
    if(!user) return res.status(400).json({ message: 'User not found' })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if(!isMatch) return res.status(400).json({ message: 'Current password incorrect' })

    const newHashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
        where: { id: req.userId },
        data: { password: newHashedPassword },
    })

    res.json({ message: 'Password updated successfully' })
})


export default router