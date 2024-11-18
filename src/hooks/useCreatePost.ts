import axios from 'axios'
import { useCallback } from 'react'
import useAuth from './useAuth'
import { successToast, errorToast } from './useToast'

const API_URL = import.meta.env.VITE_API_URL

const useCreatePost = () => {
  const { getUserToken } = useAuth()
  const createPost = useCallback(
    async (title: string, content: string) => {
      const token = await getUserToken()
      console.log(token)
      try {
        const response = await axios.post(
          `${API_URL}/posts`,
          {
            title,
            content
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        console.log(response.data)
        successToast('포스트 생성 성공')
      } catch (error) {
        console.error('Post creation failed:', error)
        errorToast('포스트 생성 실패')
        throw error
      }
    },
    [getUserToken]
  )

  return { createPost }
}

export default useCreatePost
