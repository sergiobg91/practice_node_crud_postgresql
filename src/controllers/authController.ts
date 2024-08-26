import {Request, Response} from 'express'
import { hashPassword, comparePassword } from '../services/password.service';
import prisma from '../models/user.prisma'
import { generateToken } from '../services/auth.service';

export const signin = async (req: Request, res: Response): Promise<void> => {

  const { email, password } = req.body

  try {

    if (!email) {
      res.status(400).json({message: "El email es requerido"})
      return
    }

    if (!password) {
      res.status(400).json({message: "La contrasena es requerida"})
      return
    }

    const hashedPassword = await hashPassword(password)
    const user = await prisma.create(
      {
        data: {
          email,
          password: hashedPassword
        }
      }
    )

    const token = generateToken(user)
    res.status(201).json({token})
    return

  } catch(error: any) {

    if (error?.code === 'P2002' && error.meta?.target?.includes('email')) {
      res.status(400).json({message: "El email ya esta registrado"})
      return
    }
    res.status(500).json({error: "Error en el registro"})
    return
  }
}


export const login = async (req: Request, res: Response): Promise<void> => { 

  const { email, password } = req.body

  try {
    const user = await prisma.findUnique({where: { email } })
    // const pass: string = user.password || 'default'
    
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }

    const ifPasswordOk = await comparePassword(password, user.password)
    if (!ifPasswordOk) {
      res.status(401).json({ error: 'Usuario o contrasena no coincide' })
  }
    

    const token = generateToken(user)
    res.status(200).json({token})

  } catch(error) {
    res.status(500).json({error: "Error en login"})
  }
}