import axios from 'axios'
import useAuth from './useAuth'
import { useCallback } from 'react'
import { successToast, errorToast } from '../module/toast'
import { set } from 'module/localForage'

const API_URL = import.meta.env.VITE_API_URL

const useLogin = () => {
  const { setUserToken, revokeUserAuth } = useAuth()
  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const response = await axios.post(`${API_URL}/members/login`, {
          username,
          password
        })
        setUserToken(response.data.accessToken)
        console.log(response.data)
        successToast('로그인 성공')
      } catch (error) {
        console.error('Login failed:', error)
        errorToast('로그인 실패')
        throw error
      }
    },
    [setUserToken]
  )

  const logout = useCallback(async () => {
    revokeUserAuth()
    await set(`userViewedPosts`, null)
    successToast('로그아웃 성공')
  }, [revokeUserAuth])

  return { login, logout }
}

export default useLogin
