import axios from 'axios'
import { useCallback } from 'react'
import useAuth from './useAuth'

const API_URL = import.meta.env.VITE_API_URL

const useMyLike = () => {
  const { getUserToken } = useAuth()
  const fetchMyLikes = useCallback(async () => {
    const token = await getUserToken()
    try {
      const response = await axios.get(`${API_URL}/posts/my/like`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data)
      return response.data
    } catch (error) {
      console.error('Failed to fetch liked posts:', error)
      throw error
    }
  }, [getUserToken])

  return { fetchMyLikes }
}

export default useMyLike
