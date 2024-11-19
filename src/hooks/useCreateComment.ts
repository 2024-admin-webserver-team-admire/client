import axios from 'axios'
import { useCallback } from 'react'
import useAuth from './useAuth'

const API_URL = import.meta.env.VITE_API_URL

const useCreateComment = () => {
  const { getUserToken } = useAuth()
  const createComment = useCallback(
    async (postId: string, content: string) => {
      const token = await getUserToken()
      console.log(token)
      try {
        const response = await axios.post(
          `${API_URL}/comments`,
          {
            postId,
            content
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        return response.data as number
      } catch (error) {
        console.error('Comment creation failed:', error)
        throw error
      }
    },
    [getUserToken]
  )

  return { createComment }
}

export default useCreateComment
