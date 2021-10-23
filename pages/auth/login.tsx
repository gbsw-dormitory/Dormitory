import { NextPage } from 'next'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { Cookies } from 'react-cookie'

const Login: NextPage = () => {
  const cookie = new Cookies()
  const router = useRouter()
  const [id, setId] = useState('')
  const [passwd, setPasswd] = useState('')

  async function handleSubmit (e: any) {
    e.preventDefault()
    toast.loading('로그인중...')
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, passwd })
    }).then(res => res)
    toast.remove()
    const response = await res.json()
    if (res.status !== 200) return toast.error(response.message, { icon: '😢' })
    cookie.set('token', response.token, { path: '/', httpOnly: false, secure: true })
    cookie.set('refresh', response.refreshToken, { path: '/', httpOnly: false, secure: true })
    toast.success('로그인 성공, 리다이렉트중...')
    return router.push('/')
  }
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="m-auto lg:w-3/12 md:w-8/12  w-full">
        <div className="rounded-xl shadow-2xl bg-white p-5 mx-3">
          <p className="text-xl font-bold">Dormitory 로그인</p>
            <form onSubmit={handleSubmit}>
            <input required onChange={(e) => setId(e.target.value)} placeholder="아이디를 입력해주세요" className="mt-2 p-3 rounded-lg hover:shadow-lg focus:shadow-lg bg-gray-100 w-full" /><br/>
            <input required type="password" onChange={(e) => setPasswd(e.target.value)} placeholder="비밀번호를 입력해주세요" className="mt-2 p-3 rounded-lg hover:shadow-lg focus:shadow-lg bg-gray-100 w-full" />
            <button type="submit" className="mt-3 py-2 px-4 bg-gray-200 hover:shadow-md hover:bg-green-200 rounded-md">로그인</button>
            <button type="button" className="mt-3 ml-2 py-2 px-4 bg-gray-200 hover:shadow-md hover:bg-red-200 rounded-md">비밀번호 찾기</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
