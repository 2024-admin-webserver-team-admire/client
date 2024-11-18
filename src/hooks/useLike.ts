import axios from 'axios'
import { useCallback } from 'react'
import useAuth from './useAuth'

const API_URL = import.meta.env.VITE_API_URL

const useLikePost = () => {
  const { getUserToken } = useAuth()
  const likePost = useCallback(
    async (postId: string) => {
      const token = await getUserToken()
      try {
        await axios.post(
          `${API_URL}/posts/${postId}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      } catch (error) {
        console.error('좋아요 실패:', error)
        throw error
      }
    },
    [getUserToken]
  )
  const dislikePost = useCallback(
    async (postId: string) => {
      const token = await getUserToken()
      try {
        await axios.delete(`${API_URL}/posts/${postId}/dislike`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      } catch (error) {
        console.error('싫어요 실패:', error)
        throw error
      }
    },
    [getUserToken]
  )

  return { likePost, dislikePost }
}

export default useLikePost
