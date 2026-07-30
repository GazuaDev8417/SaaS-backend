//REMEMBER YOU DIDN'T CREATE THE ROUTES BEFORE RUN NPX PRISMA DB SEED

import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"
import { authenticateToken, type AuthRequest } from "../middleware/auth.js"


const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'
const resetTimers = new Map<number, NodeJS.Timeout>()




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



router.get('/me', authenticateToken, async(req:AuthRequest, res)=>{
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


router.put('/profile', authenticateToken, async(req:AuthRequest, res)=>{
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


router.put('/password', authenticateToken, async(req:AuthRequest, res)=>{
    if(!req.userId) return res.status(401).json({ message: 'Unauthorized' })

    const { currentPassword, newPassword } = req.body
    const user = await prisma.user.findUnique({ where: { id: req.userId } })
    if(!user) return res.status(400).json({ message: 'User not found' })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if(!isMatch) return res.status(400).json({ message: 'Current password incorrect' })

    if(newPassword.length < 6){
        return res.status(403).json({ message: 'Your password must have at least 6 characters' })
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
        where: { id: req.userId },
        data: { password: newHashedPassword },
    })

    if(resetTimers.has(req.userId)){
        clearTimeout(resetTimers.get(req.userId))
    }

    const FIFTEEN_MINUTES = 15 * 60 * 1000
    const userId = req.userId

    const timer = setTimeout(async()=>{
        try{
            const defaultPassword = process.env.DEFAULT_DEMO_PASSWORD || 'passowrd123'
            const hashedPassword = await bcrypt.hash(defaultPassword, 10)

            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword, email: 'admin@example.com' }
            })

            console.log('The credentials has automatically reset to default')
            resetTimers.delete(userId)
        }catch(e){
            console.error(`Failed to auto-reset password: ${e}`)
        }
    }, FIFTEEN_MINUTES)

    resetTimers.set(req.userId, timer)

    res.json({ message: 'Password updated successfully. It will revert to default in 15 minutes' })
})


router.put('/reset-to-default', async(req, res)=>{
    try{
        const defaultPassword = process.env.DEFAULT_DEMO_PASSWORD || 'password123'
        const hashedPassword = await bcrypt.hash(defaultPassword, 10)

        const user = await prisma.user.findUnique({
            where: { default_password_identifier: 'password123' }
        })

        if(!user){
            return res.status(404).json({ message: 'User not found' })
        }

        const updateUser = await prisma.user.update({
            where: { default_password_identifier: 'password123' },
            data: { password: hashedPassword, email: 'admin@example.com' }
        })


        if(!updateUser){
            return res.status(404).json({ message: 'User not found to reset password' })
        }

        res.json({ message: 'Credentials reset to the default successfully' })
    }catch(e){
        return res.status(500).json({ message: 'Failed to reset credentials to default', e })
    }
})


export default router