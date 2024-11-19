import axios from 'axios'
import { useCallback } from 'react'
import useAuth from './useAuth'
import { CommentsResponse, PostResponse } from 'types'

const API_URL = import.meta.env.VITE_API_URL

const useMyComments = () => {
  const { getUserToken } = useAuth()
  const fetchMyComments = useCallback(async () => {
    const token = await getUserToken()
    console.log(token)
    try {
      const response = await axios.get(`${API_URL}/comments/my/write`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('&&&&&&&&&&&&&&')
      console.log(response.data)
      const data: PostResponse[] = response.data.map(
        (comment: CommentsResponse) =>
          ({
            ...comment.postResponse,
            comments: comment.comments
          }) as PostResponse
      )
      return data
    } catch (error) {
      console.error('Failed to fetch comments:', error)
      throw error
    }
  }, [getUserToken])

  return { fetchMyComments }
}

export default useMyComments
