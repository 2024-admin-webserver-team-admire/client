import axios from 'axios'
import { useCallback } from 'react'
import { successToast, errorToast } from '../module/toast'

const API_URL = import.meta.env.VITE_API_URL

const useSignUp = () => {
  const signUp = useCallback(
    async (
      username: string,
      plainPassword: string,
      name: string,
      birthday: string,
      email: string
    ) => {
      try {
        await axios.post(`${API_URL}/members`, {
          username,
          plainPassword,
          name,
          birthday,
          email
        })
        successToast('회원가입 성공')
      } catch (error) {
        console.error('Sign-in failed:', error)
        errorToast('회원가입 실패')
        throw error
      }
    },
    []
  )

  return { signUp }
}

export default useSignUp
