import db from './knex'
import qrcode from 'qrcode'
import jwt from 'jsonwebtoken'
import { User } from '../types'

export const qsign = async (uid: string) => {
  const token = jwt.sign({ uid }, process.env.JWT_SECRET as string, {
    expiresIn: '30s',
    algorithm: 'HS256'
  })
  return await qrcode.toDataURL(token)
}

export const qverify = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User
    const decodedUser = await db.where({ uid: decoded.uid }).from('user').select('*').first()
    if (!decodedUser) return false
    return decodedUser
  } catch (err) {
    return false
  }
}
