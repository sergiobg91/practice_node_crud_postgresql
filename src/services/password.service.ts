import bcrypt from 'bcrypt';

const JUMP_ROUNDS: number = 10

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, JUMP_ROUNDS)
}

export const comparePassword = async (password: string, hashPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword)
}