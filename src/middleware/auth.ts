import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'


export interface AuthRequest extends Request{
    userId?: number
}

export function authenticateToken(req:AuthRequest, res:Response, next:NextFunction){
    if(req.method === 'OPTIONS'){
        return next()
    }

    const authHeader = req.headers.authorization    
    
    if(!authHeader){
        return res.status(401).json({ message: 'Access token required' })
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret'
    const token = authHeader.split(' ')[1] || authHeader

    jwt.verify(token, secret, (err, decoded:any)=>{
        if(err){
            return res.status(403).json({ message: 'Invalid or expired token' })
        }
        req.userId = decoded.userId
        next()
    })
}