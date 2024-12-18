import axios from 'axios'
import { useCallback } from 'react'
import { PostList } from 'types'
import { errorToast } from '../module/toast'

const API_URL = import.meta.env.VITE_API_URL

const useGetPosts = () => {
  const getPosts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`)
      return response.data as PostList
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      errorToast('포스트 가져오기 실패')
      throw error
    }
  }, [])

  const getMorePosts = useCallback(async (page: number) => {
    try {
      const response = await axios.get(`${API_URL}/posts?page=${page}&size=10`)
      return response.data as PostList
    } catch (error) {
      console.error('Failed to fetch more posts:', error)
      errorToast('포스트 가져오기 실패')
      throw error
    }
  }, [])

  return { getPosts, getMorePosts }
}

export default useGetPosts
