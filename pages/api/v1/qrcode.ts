import db from '../../../module/knex'
import { User } from '../../../types'
import { verify } from '../../../module/token'
import { qsign, qverify } from '../../../module/qrcode'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const QrcodeApi: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.headers.authorization) return res.status(401).json({ error: 'Unauthorized' })
  const { success, uid } = await verify(req.headers.authorization.split('Bearer ')[1])
  if (req.method === 'GET') {
    if (!success) return res.status(401).json({ error: 'Unauthorized' })
    return res.send(await qsign(uid as string))
  } else if (req.method === 'POST') {
    const { token, qrcode } = req.body
    if (!token || !qrcode) return res.status(400).json({ error: 'Bad Request' })
    const existToken = await db.select('*').from('apikey').where({ token }).first()
    if (!existToken) return res.status(401).json({ error: 'Unauthorized' })
    if (existToken.permission) return res.status(403).json({ error: 'Forbidden' })
    const decodedUser = await qverify(qrcode) as User
    if (!decodedUser) return res.status(404).json({ error: 'User not found' })
    return res.json(decodedUser)
  }
}

export default QrcodeApi
