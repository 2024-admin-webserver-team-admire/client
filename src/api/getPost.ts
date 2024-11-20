import axios from 'axios'
import { get, set } from 'module/localForage'
import { errorToast } from 'module/toast'
import { Post, PostResponse } from 'types'

const API_URL = import.meta.env.VITE_API_URL

const getPost = async (postId?: string): Promise<PostResponse> => {
  try {
    const cookie = await get(`userViewedPosts/${postId}`)
    const postResponse = await axios.get(`${API_URL}/posts/${postId}`, {
      headers: {
        Viewedposts: cookie
      }
    })
    const post = postResponse.data as Post
    const commentsResponse = await axios.get(
      `${API_URL}/comments/posts/${postId}`
    )
    const comments = commentsResponse.data as PostResponse
    if (postResponse.headers['viewedposts']) {
      await set(
        `userViewedPosts/${postId}`,
        postResponse.headers['viewedposts']
      )
    }
    return { ...post, comments: comments.comments }
  } catch (error) {
    console.error('Failed to fetch post:', error)
    errorToast('포스트 가져오기 실패')
    throw error
  }
}

export default getPost
