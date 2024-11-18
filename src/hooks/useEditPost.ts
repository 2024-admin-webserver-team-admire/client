import axios from 'axios'
import { useCallback } from 'react'
import useAuth from './useAuth'
import { successToast, errorToast } from './useToast'

const API_URL = import.meta.env.VITE_API_URL

const useEditPost = () => {
  const { getUserToken } = useAuth()
  const editPost = useCallback(
    async (postId: string, title: string, content: string) => {
      const token = await getUserToken()
      console.log(token)
      try {
        const response = await axios.put(
          `${API_URL}/posts/${postId}`,
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
        successToast('포스트 수정 성공')
      } catch (error) {
        console.error('Post editing failed:', error)
        errorToast('포스트 수정 실패')
        throw error
      }
    },
    [getUserToken]
  )

  return { editPost }
}

export default useEditPost
