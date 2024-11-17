import Header from 'components/Header'
import useAuth from 'hooks/useAuth'
import useSignUp from 'hooks/useSignUp'
import { useToast } from 'hooks/useToast'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignUp() {
  const { isAuthorized } = useAuth()
  const [username, setUsername] = useState('')
  const [birth, setBirth] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signUp } = useSignUp()
  const { errorToast } = useToast()
  const navigate = useNavigate()
  const onPressSignUp = useCallback(async () => {
    if (email === '') {
      errorToast('이메일을 입력해주세요.')
      return
    }
    if (username === '') {
      errorToast('ID를 입력해주세요.')
      return
    }
    if (nickname === '') {
      errorToast('닉네임을 입력해주세요.')
      return
    }
    if (birth === '') {
      errorToast('생년월일을 입력해주세요.')
      return
    }
    if (password === '') {
      errorToast('비밀번호를 입력해주세요.')
      return
    }
    if (birth.match(/^\d{4}-\d{2}-\d{2}$/) === null) {
      errorToast('생년월일 형식이 올바르지 않습니다.')
      return
    }
    await signUp(username, password, nickname, birth, email)
    navigate('/login')
  }, [email, username, nickname, birth, password, signUp, navigate, errorToast])

  if (isAuthorized) {
    navigate('/')
  }

  return (
    <div
      className="group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden bg-[#FFFFFF]"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="flex flex-1 justify-center px-40 py-5">
          <div className="layout-content-container flex w-[512px] max-w-[512px] flex-1 flex-col py-5">
            <h1 className="px-4 pb-3 pt-5 text-center text-[22px] font-bold leading-tight tracking-[-0.015em] text-black">
              동경 게시판에 오신 것을 환영합니다.
            </h1>
            <div className="flex min-w-[380px] max-w-[480px] flex-wrap items-center gap-4 self-center px-4 py-3">
              <label className="flex min-w-40 flex-1 flex-col">
                <input
                  placeholder="Email"
                  className="flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#EEEEEE] p-4 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <div className="flex min-w-[330px] max-w-[480px] flex-wrap items-center gap-4 self-center px-4 py-3">
              <label className="flex min-w-[30px] flex-row gap-2">
                <input
                  placeholder="ID"
                  className="flex h-14 max-w-[170px] flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#EEEEEE] p-4 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  placeholder="닉네임"
                  className="flex h-14 max-w-[170px] flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#EEEEEE] p-4 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </label>
            </div>
            <div className="flex min-w-[380px] max-w-[480px] flex-wrap items-center gap-4 self-center px-4 py-3">
              <label className="flex min-w-40 flex-1 flex-col">
                <input
                  placeholder="생년월일 (YYYY-MM-DD)"
                  className="flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#EEEEEE] p-4 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
                  value={birth}
                  onChange={(e) => setBirth(e.target.value)}
                />
              </label>
            </div>
            <div className="flex min-w-[380px] max-w-[480px] flex-wrap items-end gap-4 self-center px-4 py-3">
              <label className="flex min-w-40 flex-1 flex-col">
                <input
                  placeholder="비밀번호"
                  className="flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#EEEEEE] p-4 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <div className="flex px-4 py-3">
              <button
                className="flex h-10 min-w-[84px] max-w-[480px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-black px-4 text-sm font-bold leading-normal tracking-[0.015em] text-[#FFFFFF]"
                onClick={onPressSignUp}
              >
                <span className="truncate">회원가입</span>
              </button>
            </div>
            <p className="px-4 pb-3 pt-1 text-center text-sm font-normal leading-normal text-[#6B6B6B]">
              회원가입 후 로그인을 해야 게시판을 이용할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
