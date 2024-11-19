import axios from 'axios'
import { useCallback } from 'react'
import useAuth from './useAuth'

const API_URL = import.meta.env.VITE_API_URL

const useDeleteComment = () => {
  const { getUserToken } = useAuth()
  const deleteComment = useCallback(
    async (commentId: string) => {
      const token = await getUserToken()
      console.log(token)
      try {
        const response = await axios.delete(
          `${API_URL}/comments/${commentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        return response.data
      } catch (error) {
        console.error('Comment deletion failed:', error)
        throw error
      }
    },
    [getUserToken]
  )

  return { deleteComment }
}

export default useDeleteComment
