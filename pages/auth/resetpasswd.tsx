import { NextPage } from 'next'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

const Login: NextPage = () => {
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
    if (res.status !== 200) return toast.error((await res.json()).message, { icon: '😢' })
    toast.success('로그인 성공, 리다이렉트중...')
    return router.push('/')
  }
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="m-auto lg:w-3/12 md:w-8/12  w-full">
        <div className="rounded-xl shadow-2xl bg-white p-5 mx-3">
          <p className="text-xl font-bold">Dormitory 비밀번호 변경</p>
            <form onSubmit={handleSubmit}>
            <input required onChange={(e) => setId(e.target.value)} placeholder="아이디를 입력해주세요" className="mt-2 p-3 rounded-lg hover:shadow-lg focus:shadow-lg bg-gray-100 w-full" /><br/>
            <div className="flex">
              <input required type="number" onChange={(e) => setPasswd(e.target.value)} placeholder="전화번호를 입력해주세요" className="mt-2 p-3 rounded-lg hover:shadow-lg focus:shadow-lg bg-gray-100 w-full" />
              <button type="button" className="mt-2 ml-2 bg-gray-200 hover:shadow-md hover:bg-green-200 rounded-md min-w-max px-3">인증번호 발송</button>
            </div>
            <button type="submit" className="mt-3 py-2 px-4 bg-gray-200 hover:shadow-md hover:bg-green-200 rounded-md">비밀번호 찾기</button>
            <button type="button" className="mt-3 ml-2 py-2 px-4 bg-gray-200 hover:shadow-md hover:bg-red-200 rounded-md"></button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
