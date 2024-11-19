import Header from 'components/Header'
import useAuth from 'hooks/useAuth'
import Unauthorized from './Unauthorized'
import useMyLike from 'hooks/useMyLike'
import useMyComments from 'hooks/useMyComments'
import useMyPosts from 'hooks/useMyPosts'
import { useEffect } from 'react'
import moment from 'moment'
import ProfileImage from 'components/ProfileImage'
import { Link } from 'react-router-dom'

export const MyPage = () => {
  const { isAuthorized } = useAuth()
  const { fetchMyLikes, isLoaded: myLikePostsLoaded, myLikePosts } = useMyLike()
  const {
    fetchMyComments,
    isLoaded: myCommentsLoaded,
    myComments
  } = useMyComments()
  const { fetchMyPosts, isLoaded: myPostsLoaded, myPosts } = useMyPosts()

  useEffect(() => {
    if (!myLikePostsLoaded) {
      fetchMyLikes()
    }
    if (!myCommentsLoaded) {
      fetchMyComments()
    }
    if (!myPostsLoaded) {
      fetchMyPosts()
    }
  }, [
    fetchMyLikes,
    fetchMyComments,
    fetchMyPosts,
    myLikePostsLoaded,
    myCommentsLoaded,
    myPostsLoaded
  ])

  if (!isAuthorized) {
    return <Unauthorized />
  }

  return (
    <>
      <Header />
      <h3 className="px-4 pb-2 pt-4 text-lg font-bold leading-tight tracking-[-0.015em] text-black">
        Likes
      </h3>
      {myLikePosts.map((post) => {
        return (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            className="flex items-center justify-between gap-4 bg-[#FFFFFF] px-4 py-3"
          >
            <div className="flex items-center gap-4">
              <ProfileImage name={post.writer.name} />
              <div className="flex flex-col justify-center">
                <p className="line-clamp-1 text-base font-medium leading-normal text-black">
                  {post.title}
                </p>
                <p className="line-clamp-2 text-sm font-normal leading-normal text-[#6B6B6B]">
                  {post.writer.name} • {moment(post.createdDate).fromNow()}
                </p>
              </div>
            </div>
          </Link>
        )
      })}

      <h3 className="px-4 pb-2 pt-4 text-lg font-bold leading-tight tracking-[-0.015em] text-black">
        Posts
      </h3>
      {myPosts.map((post) => {
        return (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            className="flex items-center justify-between gap-4 bg-[#FFFFFF] px-4 py-3"
          >
            <div className="flex items-center gap-4">
              <ProfileImage name={post.writer.name} />
              <div className="flex flex-col justify-center">
                <p className="line-clamp-1 text-base font-medium leading-normal text-black">
                  {post.title}
                </p>
                <p className="line-clamp-2 text-sm font-normal leading-normal text-[#6B6B6B]">
                  {post.writer.name} • {moment(post.createdDate).fromNow()}
                </p>
              </div>
            </div>
          </Link>
        )
      })}
      <h3 className="px-4 pb-2 pt-4 text-lg font-bold leading-tight tracking-[-0.015em] text-black">
        Comments
      </h3>
      {myComments.map((comment) => {
        return (
          <Link
            key={comment.comments.id}
            to={`/posts/${comment.id}`}
            className="flex items-center justify-between gap-4 bg-[#FFFFFF] px-4 py-3"
          >
            <div className="flex items-center gap-4">
              <ProfileImage name={comment.writer.name} />
              <div className="flex flex-col justify-center">
                <p className="line-clamp-1 text-base font-medium leading-normal text-black">
                  {comment.comments.content}
                </p>
                <p className="line-clamp-2 text-sm font-normal leading-normal text-[#6B6B6B]">
                  {comment.comments.writer.name} •{' '}
                  {moment(comment.comments.createdDate).fromNow()}
                </p>
              </div>
            </div>
          </Link>
        )
      })}
    </>
  )
}
