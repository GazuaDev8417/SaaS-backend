import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'


export interface AuthRequest extends Request{
    userId?: number
}

export function authenticateToken(req:AuthRequest, res:Response, next:NextFunction){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(401).json({ message: 'Access token required' })
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret'

    jwt.verify(token, secret, (err, decoded:any)=>{
        if(err){
            return res.status(403).json({ message: 'Invalid or expired token' })
        }
        req.userId = decoded.userId
        next()
    })
}