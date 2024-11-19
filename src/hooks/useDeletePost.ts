import axios from 'axios'
import { useCallback } from 'react'
import useAuth from './useAuth'
import { successToast, errorToast } from '../module/toast'

const API_URL = import.meta.env.VITE_API_URL

const useDeletePost = () => {
  const { getUserToken } = useAuth()
  const deletePost = useCallback(
    async (postId: string) => {
      const token = await getUserToken()
      try {
        await axios.delete(`${API_URL}/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        successToast('포스트 삭제 성공')
      } catch (error) {
        console.error('Post deletion failed:', error)
        errorToast('포스트 삭제 실패')
        throw error
      }
    },
    [getUserToken]
  )

  return { deletePost }
}

export default useDeletePost
