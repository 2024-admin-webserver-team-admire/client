import axios from 'axios'
import { useCallback, useState } from 'react'
import useAuth from './useAuth'
import { Post } from 'types'

const API_URL = import.meta.env.VITE_API_URL

const useMyLike = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [myLikePosts, setMyLikePosts] = useState<Post[]>([])
  const { getUserToken } = useAuth()
  const fetchMyLikes = useCallback(async () => {
    const token = await getUserToken()
    try {
      const response = await axios.get(`${API_URL}/posts/my/like`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsLoaded(true)
      setMyLikePosts(response.data)
      return response.data as Post[]
    } catch (error) {
      console.error('Failed to fetch liked posts:', error)
      throw error
    }
  }, [getUserToken])

  return { fetchMyLikes, isLoaded, myLikePosts }
}

export default useMyLike
