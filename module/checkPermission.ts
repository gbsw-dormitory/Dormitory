import { User } from '../types'
import db from './knex'
import { verify } from './token'

export default async function checkPermission (token: string, permission: number[]) {
  const decode = await verify(token) as { success: boolean; uid?: string; message?: string }
  if (!decode.success) return { success: false, message: decode.message }
  const user = await db.select('*').from('user').where({ uid: decode.uid }).first() as User

  if (!user) return { success: false, message: 'User not found' }
  if (permission.includes(9)) return { success: true, user, per: user.permission }
  if (!permission.includes(user.permission)) return { success: false, message: 'Permission denied' }
  return { success: true, user, per: user.permission }
}
