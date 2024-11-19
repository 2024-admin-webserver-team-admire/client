import axios from 'axios'
import { useCallback } from 'react'
import useAuth from './useAuth'

const API_URL = import.meta.env.VITE_API_URL

const useEditComment = () => {
  const { getUserToken } = useAuth()
  const editComment = useCallback(
    async (id: string, content: string) => {
      const token = await getUserToken()
      console.log(token)
      try {
        const response = await axios.put(
          `${API_URL}/comments/${id}`,
          {
            content
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        return response.data
      } catch (error) {
        console.error('Comment edit failed:', error)
        throw error
      }
    },
    [getUserToken]
  )

  return { editComment }
}

export default useEditComment
