import db from '../../../module/knex'
import ranStr from 'crypto-random-string'
import checkPermission from '../../../module/checkPermission'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const RewardApi: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized' })
  const token = req.headers.authorization.split(' ')[1]

  if (req.method === 'POST') {
    const { success, message } = await checkPermission(token, [1, 2, 3])
    if (!success) return res.status(403).json({ message })
    const { uid, rid, reason } = req.body
    if (!uid || !rid) return res.status(400).json({ message: 'Bad Request' })
    await db.insert({ rid, uid, reason, yid: ranStr({ length: 10 }) }).into('reward_user')
    return res.status(200).json({ message: 'success' })
  } else if (req.method === 'GET') {
    const { success, message, user, per } = await checkPermission(token, [9])
    if (!success) return res.status(403).json({ message })
    const reward = await db.from('reward_user')
      .join('reward', 'reward.rid', 'reward_user.rid')
      .join('user', 'user.uid', 'reward_user.uid')
      .where(!per ? { 'user.uid': user?.uid } : {})
      .orderBy('user.uid', 'desc')
      .select(['yid', 'user.uid', 'date', 'reason', 'type', 'user.name', 'point', 'user.sex', 'user.phone'])
    if (!reward) return res.status(404).json({ message: 'Not Found' })
    return res.status(200).json({ reward })
  } else if (req.method === 'DELETE') {
    const { success, message } = await checkPermission(token, [1, 2, 3])
    if (!success) return res.status(403).json({ message })
    const { yid } = req.body
    if (!yid) return res.status(400).json({ message: 'Bad Request' })
    await db.delete().from('reward_user').where({ yid })
    return res.status(200).json({ message: 'success' })
  }
}

export default RewardApi
