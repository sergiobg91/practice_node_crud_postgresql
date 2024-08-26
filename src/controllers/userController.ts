import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";
import  prisma  from "../models/user.prisma";


export const createUser = async (req: Request, res: Response): Promise<void> => {

  try {

    const { email, password } = req.body

    if (!email) {
      res.status(400).json({message: "El email es requerido"})
      return
    }

    if (!password) {
      res.status(400).json({message: "La contraseña es requerida"})
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

    res.status(201).json(user)
    return

  }catch(error) {
    res.status(500).json({message: "Error del servidor"})
  }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => { 

  try {
    const users = await prisma.findMany()
    res.status(200).json(users)
    return

  } catch(error) {
    res.status(500).json({message: "Error del servidor"})
    return
  }
}

export const getUserByID = async (req: Request, res: Response): Promise<void> => { 

  const userID = parseInt(req.params.id)

  try {
    const user = await prisma.findUnique({where: {id: userID} })

    if (!user) {
      res.status(404).json({message: "Usuario no encontrado"})
      return
    }

    res.status(200).json(user)
    return

  } catch(error) {
    res.status(500).json({message: "Error del servidor"})
    return
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => { 

  const userID = parseInt(req.params.id)
  const { email, password } = req.body
  
  try {
    let infoToUpdate: any = { ...req.body}

    email ? infoToUpdate.email = email : email
    password ? infoToUpdate.password = await hashPassword(password) : password

    const user = await prisma.update( {where: {id: userID}, data: infoToUpdate }) 

    res.status(200).json(user)
    return

  } catch(error: any) {

    if (error?.code === 'P2002' && error?.meta.target.includes('email')) {
      res.status(400).json({message: "El email ingresado ya existe"})
      return
    }
    else if (error?.code === 'P2025') {
      res.status(404).json({message: "Usuario no encontrado"})
      return
    }

    res.status(500).json({message: "Error del servidor"})
    return
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => { 

  const userID = parseInt(req.params.id)

  try {

    await prisma.delete( {where: {id: userID} })
    res.status(204).json([]).end()

  } catch(error: any) {
      if (error?.code === 'P2025') {
      res.status(404).json({message: "Usuario no encontrado"})
      return
    }
  }
  
}