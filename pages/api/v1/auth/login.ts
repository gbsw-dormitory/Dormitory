import { SHA3 } from 'sha3'
import db from '../../../../module/knex'
import { refresh, sign } from '../../../../module/token'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const Login: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end()
  const { id, passwd } = req.body
  if (!id || !passwd) return res.status(400).json({ message: '아이디 또는 패스워드가 없습니다.' })
  const user = await db('user').where({ id }).first()
  if (!user) return res.status(404).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' })
  if (user.passwd !== Hash(user.salt, passwd)) return res.status(404).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' })

  const accessToken = sign(user)
  const refreshToken = refresh()
  await db.select('*').from('refresh').insert({ uid: user.uid, refresh: refreshToken })
    .onConflict('refresh').merge().update({ refresh: refreshToken })
  return res.json({ success: true, token: accessToken, refreshToken: refreshToken })
}

export default Login

function Hash (salt: string, passwd: string) {
  const hash = new SHA3(512)
  hash.reset()
  return hash.update(salt + passwd).digest('hex')
}
