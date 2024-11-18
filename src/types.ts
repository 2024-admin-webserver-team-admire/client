export interface Writer {
  id: number
  name: string
}

export interface Post {
  writer: Writer
  id: number
  title: string
  content: string
  likeCount: number
  viewCount: number
  commentCount: number
  createdDate: Date
}

export interface PostResponse extends Post {
  comments: Comment[]
}

export interface Comment {
  id: number
  content: string
  createdDate: Date
  writer: Writer
}

export interface CommentsResponse {
  comments: Comment[]
  postResponse: Post
}

export interface PostList {
  content: Post[]
  totalPage: number
  currentPage: number
  pageSize: number
  totalElementsCount: number
  currentElementsCount: number
}
