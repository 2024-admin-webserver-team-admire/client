import Header from 'components/Header'
import useAuth from 'hooks/useAuth'
import useLogin from 'hooks/useLogin'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { isAuthorized } = useAuth()
  const { login } = useLogin()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onPressLogin = useCallback(async () => {
    await login(username, password)
    navigate('/')
  }, [username, password, login, navigate])

  const onPressSignup = useCallback(() => {
    navigate('/signup')
  }, [navigate])

  if (isAuthorized) {
    navigate('/')
  }

  return (
    <div
      className="group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden bg-[#FFFFFF]"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onPressLogin()
        }
      }}
    >
      <div className="flex h-full grow flex-col">
        <Header />
        <div className="flex flex-1 justify-center px-40 py-5">
          <div className="flex w-[512px] max-w-[512px] flex-1 flex-col py-5">
            <h1 className="px-4 pb-3 pt-5 text-center text-[22px] font-bold leading-tight tracking-[-0.015em] text-black">
              동경 게시판에 오신 것을 환영합니다.
            </h1>
            <div className="flex min-w-[380px] max-w-[480px] flex-wrap items-center gap-4 self-center px-4 py-3">
              <label className="flex min-w-40 flex-1 flex-col">
                <input
                  placeholder="ID"
                  className=" flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#EEEEEE] p-4 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
            </div>
            <div className="flex min-w-[380px] max-w-[480px] flex-wrap items-end gap-4 self-center px-4 py-3">
              <label className="flex min-w-40 flex-1 flex-col">
                <input
                  placeholder="Password"
                  type="password"
                  className=" flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#EEEEEE] p-4 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <div className="flex px-4 py-3">
              <button
                className="flex h-10 min-w-[84px] max-w-[480px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-black px-4 text-sm font-bold leading-normal tracking-[0.015em] text-[#FFFFFF]"
                onClick={onPressLogin}
              >
                <span className="truncate">로그인</span>
              </button>
            </div>
            <div className="flex px-4 py-3">
              <button
                className="flex h-10 min-w-[84px] max-w-[480px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-black px-4 text-sm font-bold leading-normal tracking-[0.015em] text-[#FFFFFF]"
                onClick={onPressSignup}
              >
                <span className="truncate">회원가입 페이지로 이동</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
