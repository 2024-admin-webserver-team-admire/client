import axios from 'axios'
import { useCallback } from 'react'
import useAuth from './useAuth'
import { errorToast } from './useToast'
import { Post } from 'types'

const API_URL = import.meta.env.VITE_API_URL

const useMyPosts = () => {
  const { getUserToken } = useAuth()
  const fetchMyPosts = useCallback(async () => {
    const token = await getUserToken()
    console.log(token)
    try {
      const response = await axios.get(`${API_URL}/posts/my/write`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data)
      return response.data as Post[]
    } catch (error) {
      console.error('Failed to fetch my posts:', error)
      errorToast('내 포스트 불러오기 실패')
      throw error
    }
  }, [getUserToken])

  return { fetchMyPosts }
}

export default useMyPosts
