import jwt from 'jsonwebtoken'
import { refreshVerify, verify, sign } from '../../../../module/token'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { User } from '../../../../types'

const RefreshAPI: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).end()
  if (!req.headers.authorization || !req.headers.refresh) return res.status(401).json({ error: 'Unauthorized' })
  const authToken = req.headers.authorization.split('Bearer ')[1]
  const refreshToken = req.headers.refresh as string

  const authResult = verify(authToken)
  const decoded = jwt.decode(authToken) as User
  if (decoded === null) return res.status(401).json({ error: 'Unauthorized' })
  const refreshResult = await refreshVerify(refreshToken, decoded.uid)

  if (authResult.success || authResult.message !== 'jwt expired') return res.status(400).json({ error: 'AccessToken is not expired' })
  if (refreshResult) {
    const newAccessToken = sign(decoded)
    return res.status(200).json({ accessToken: newAccessToken, refreshToken })
  }
  return res.status(401).json({ error: 'Unauthorized' })
}

export default RefreshAPI
