import axios from 'axios'
import { useCallback, useState } from 'react'
import useAuth from './useAuth'
import { Post } from 'types'

const API_URL = import.meta.env.VITE_API_URL

const useMyPosts = () => {
  const { getUserToken } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)
  const [myPosts, setMyPosts] = useState<Post[]>([])
  const fetchMyPosts = useCallback(async () => {
    const token = await getUserToken()
    try {
      const response = await axios.get(`${API_URL}/posts/my/write`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsLoaded(true)
      setMyPosts(response.data as Post[])
      return response.data as Post[]
    } catch (error) {
      console.error('Failed to fetch my posts:', error)
      throw error
    }
  }, [getUserToken])

  return { fetchMyPosts, isLoaded, myPosts }
}

export default useMyPosts
