import axios from 'axios'
import { useCallback } from 'react'
import { Post, PostList, CommentsResponse } from 'types'
import { errorToast } from './useToast'

const API_URL = import.meta.env.VITE_API_URL

const useGetPosts = () => {
  const getPosts = useCallback(async () => {
    console.log('getPosts')
    try {
      const response = await axios.get(`${API_URL}/posts`)
      console.log(response.data)
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
