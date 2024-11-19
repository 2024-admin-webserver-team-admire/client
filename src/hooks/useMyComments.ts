import axios from 'axios'
import { useCallback, useState } from 'react'
import useAuth from './useAuth'
import { CommentsResponse, MyCommentResponse } from 'types'

const API_URL = import.meta.env.VITE_API_URL

const useMyComments = () => {
  const { getUserToken } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)
  const [myComments, setMyComments] = useState<MyCommentResponse[]>([])
  const fetchMyComments = useCallback(async () => {
    const token = await getUserToken()
    try {
      const response = await axios.get(`${API_URL}/comments/my/write`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data: MyCommentResponse[] = response.data.map(
        (comment: CommentsResponse) =>
          ({
            ...comment.postResponse,
            comments: comment.comments
          }) as MyCommentResponse
      )
      setIsLoaded(true)
      setMyComments(data)
      return data
    } catch (error) {
      console.error('Failed to fetch comments:', error)
      throw error
    }
  }, [getUserToken])

  return { fetchMyComments, isLoaded, myComments }
}

export default useMyComments
