import axios from 'axios'
import { get, set } from 'module/localForage'
import { errorToast } from 'module/toast'
import { CommentsResponse, Post, PostResponse } from 'types'

const API_URL = import.meta.env.VITE_API_URL

const getPost = async (postId?: string): Promise<PostResponse> => {
  try {
    const postResponse = await axios.get(`${API_URL}/posts/${postId}`)
    const post = postResponse.data as Post
    const cookie = await get(`userViewedPosts/${postId}`)
    console.log(cookie)
    const commentsResponse = await axios.get(
      `${API_URL}/comments/posts/${postId}`,
      {
        headers: {
          'Set-Cookie': cookie
        }
      }
    )
    const comments = commentsResponse.data as CommentsResponse
    console.log('COOKIE')
    console.log(commentsResponse.headers)
    console.log(commentsResponse.headers['Set-Cookie'])
    await set(
      `userViewedPosts/${postId}`,
      commentsResponse.headers['set-cookie']
    )
    return { ...post, comments: comments.comments }
  } catch (error) {
    console.error('Failed to fetch post:', error)
    errorToast('포스트 가져오기 실패')
    throw error
  }
}

export default getPost
