import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, deleteUser, getAllUsers, getUserByID, updateUser } from '../controllers/userController';

const router = express.Router()

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] //token despues del bearer

  if(!token) {
    res.status(401).json({message: "No autorizado"})
  }

  jwt.verify((token || 'token'), (process.env.JWT_SECRET || 'default'), (err, decoded)=> {
    if (err) {
      console.error("Error en la autenticacion")
      return res.status(403).json({error: "Sin acceso al recurso"})
    }
  })
  
  next()

}

router.post('/', authenticateToken, createUser)
router.get('/', authenticateToken, getAllUsers)
router.get('/:id', authenticateToken, getUserByID)
router.put('/:id', authenticateToken, updateUser)
router.delete('/:id', authenticateToken, deleteUser)

export default router