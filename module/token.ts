import db from '../module/knex'
import jwt from 'jsonwebtoken'
import { User } from '../types/index'

export interface UserRefresh {
  refresh: string
  uid: string
}

export const sign = (user: User) => {
  const payload = {
    uid: user.uid
  }

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
    algorithm: 'HS256'
  })
}

export const refresh = () => {
  return jwt.sign({}, process.env.JWT_SECRET as string, {
    algorithm: 'HS256',
    expiresIn: '14d'
  })
}

export const verify = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User
    return {
      success: true,
      uid: decoded.uid
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message
    }
  }
}

export const refreshVerify = async (token: string, uid: string) => {
  const userRefresh = await db.select('*').from('dormitory.refresh').where({ uid }).first() as UserRefresh
  if (!userRefresh) {
    return {
      success: false,
      message: 'refresh token not found'
    }
  }
  if (token === userRefresh.refresh) {
    try {
      jwt.verify(token, process.env.JWT_SECRET as string)
      return true
    } catch (err) { return false }
  } else return false
}
