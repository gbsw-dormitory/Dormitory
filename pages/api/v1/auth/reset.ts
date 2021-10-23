import moment from 'moment'
import db from '../../../../module/knex'
import ranStr from 'crypto-random-string'
import checkPermission from '../../../../module/checkPermission'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const ResetPasswdApi: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).end()
  if (!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized' })
  const token = req.headers.authorization.split(' ')[1]

  const { success, message, user } = await checkPermission(token, [9])
  if (!success) return res.status(403).json({ error: message })
  const code = await db.from('passwd_token').where({ uid: user?.uid }).first()
  if (code && cacutime(code?.created_at)) {
    return res.status(400).json({ message: '기존 인증번호가 만료되지않았습니다. 만료일: ' + moment(code.created_at).add('3', 'M').format('YYYY/MM/DD hh:mm:ss') })
  }
  if (!code || moment(code?.created_at).add('3m').toDate() < moment().toDate()) {
    const newCode = ranStr({ length: 10, type: 'alphanumeric' })
    await db.from('passwd_token').insert({ uid: user?.uid, reset: newCode, created_at: new Date() })
      .onConflict('uid').merge({ reset: newCode, created_at: new Date() })
    /* 인증번호를 발송코드   */
    return res.status(200).json({ message: '인증번호를 발송했습니다.' })
  }
}

export default ResetPasswdApi

function cacutime (created: Date) {
  const now = Number(moment().format('YYYYMMDDhhmmss'))
  console.log(Number(moment(created).add('3M').format('YYYYMMDDhhmmss')), now)
if (Number(moment(created).add('3', 'M').format('YYYYMMDDhhmmss')) > now) {
    return true
  } else return false
}
