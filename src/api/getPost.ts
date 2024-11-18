import axios from 'axios'
import { errorToast } from 'hooks/useToast'
import { CommentsResponse, Post, PostResponse } from 'types'

const API_URL = import.meta.env.VITE_API_URL

const getPost = async (postId?: string): Promise<PostResponse> => {
  try {
    const postResponse = await axios.get(`${API_URL}/posts/${postId}`)
    const post = postResponse.data as Post
    const commentsResponse = await axios.get(
      `${API_URL}/comments/posts/${postId}`
    )
    const comments = commentsResponse.data as CommentsResponse
    return { ...post, comments: comments.comments }
  } catch (error) {
    console.error('Failed to fetch post:', error)
    errorToast('포스트 가져오기 실패')
    throw error
  }
}

export default getPost
