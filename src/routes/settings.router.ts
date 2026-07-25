import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authenticateToken, type AuthRequest } from "../middleware/auth.js"

const router = Router()

router.use(authenticateToken)


router.get('/notifications', async(req:AuthRequest, res)=>{
  try{
    if(!req.userId){
      return res.status(401).json({ message: 'Unauthorized'})
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId},
      select: {
        emailNotifs: true,
        pushNotifs: true,
        marketingEmails: true
      }
    })

    if(!user){
      res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  }catch(e){
    res.status(500).json({ message: "Failed to fetch notifications settings" })
  }
})

// PUT /api/settings/notifications - Update notification toggles
router.put("/notifications", async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { emailNotifs, pushNotifs, marketingEmails } = req.body

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        emailNotifs,
        pushNotifs,
        marketingEmails,
      },
      select: {
        emailNotifs: true,
        pushNotifs: true,
        marketingEmails: true,
      },
    })

    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification settings" })
  }
})

export default router