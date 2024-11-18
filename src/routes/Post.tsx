import Header from 'components/Header'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { PostResponse, Post as PostType } from 'types'
import { IoMdPerson } from 'react-icons/io'
import { FaCalendar, FaRegCommentAlt } from 'react-icons/fa'
import { MdModeEdit, MdDelete, MdCancel, MdCheckCircle } from 'react-icons/md'
import { BiLike, BiSolidLike } from 'react-icons/bi'
import useDeletePost from 'hooks/useDeletePost'
import useEditPost from 'hooks/useEditPost'
import getPost from 'api/getPost'
import useMyPosts from 'hooks/useMyPosts'
import useMyLike from 'hooks/useMyLike'
import useLike from 'hooks/useLike'

const Post = () => {
  const loaderData = useLoaderData() as PostResponse
  const [post, setPost] = useState(loaderData)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [myPosts, setMyPosts] = useState<PostType[]>([])
  const [myLikePosts, setMyLikePosts] = useState<PostType[]>([])
  const [myPostsLoaded, setMyPostsLoaded] = useState(false)
  const [myLikePostsLoaded, setMyLikePostsLoaded] = useState(false)
  const { deletePost } = useDeletePost()
  const { editPost } = useEditPost()
  const { likePost, dislikePost } = useLike()
  const { fetchMyPosts } = useMyPosts()
  const { fetchMyLikes } = useMyLike()
  const navigate = useNavigate()
  const canEdit = useMemo(
    () => myPosts.some((myPost) => myPost.id === post.id),
    [myPosts, post.id]
  )
  const canLike = useMemo(
    () => !myLikePosts.some((myLikePost) => myLikePost.id === post.id),
    [myLikePosts, post.id]
  )

  useEffect(() => {
    setPost(loaderData)
  }, [loaderData])
  useEffect(() => {
    if (!myPostsLoaded) {
      fetchMyPosts().then((posts) => {
        setMyPosts(posts)
        setMyPostsLoaded(true)
      })
    }
    if (!myLikePostsLoaded) {
      fetchMyLikes().then((posts) => {
        setMyLikePosts(posts)
        setMyLikePostsLoaded(true)
      })
    }
  }, [fetchMyPosts, fetchMyLikes, myPostsLoaded, myLikePostsLoaded])

  const onPressEdit = () => {
    setIsEditing(true)
  }
  const onPressEditCancel = () => {
    setIsEditing(false)
  }
  const onPressEditConfirm = async () => {
    await editPost(`${post.id}`, title, content)
    const data = await getPost(`${post.id}`)
    setPost(data)
    setIsEditing(false)
  }
  const onPressDelete = async () => {
    await deletePost(`${post.id}`)
    navigate('/posts')
  }
  const onPressLike = async () => {
    if (canLike) {
      setMyLikePosts((prev) => [...prev, post])
      setPost((prev) => ({
        ...prev,
        likeCount: prev.likeCount + 1
      }))
      try {
        await likePost(`${post.id}`)
      } catch (error) {
        setMyLikePosts((prev) => prev.filter((p) => p.id !== post.id))
        setPost((prev) => ({
          ...prev,
          likeCount: prev.likeCount - 1
        }))
      }
    } else {
      setMyLikePosts((prev) => prev.filter((p) => p.id !== post.id))
      setPost((prev) => ({
        ...prev,
        likeCount: prev.likeCount - 1
      }))
      try {
        await dislikePost(`${post.id}`)
      } catch (error) {
        setMyLikePosts((prev) => [...prev, post])
        setPost((prev) => ({
          ...prev,
          likeCount: prev.likeCount + 1
        }))
      }
    }
  }

  return (
    <div
      className="group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden bg-[#FFFFFF]"
      style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="flex flex-1 justify-center px-40 py-5">
          <div className="layout-content-container flex max-w-[960px] flex-1 flex-col">
            <div className="flex flex-wrap gap-3 p-3 pr-4">
              <div className="flex grow flex-wrap gap-3 self-start">
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#F0F2F5] px-4">
                  <p className="flex flex-row items-center gap-x-1 text-sm font-medium leading-normal text-[#141414]">
                    <IoMdPerson /> {post.writer.name}
                  </p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#F0F2F5] px-4">
                  <p className="flex flex-row items-center gap-x-1 text-sm font-medium leading-normal text-[#141414]">
                    <FaCalendar />
                    {moment(post.createdDate).format('YYYY-MM-DD')}
                  </p>
                </div>
              </div>
              {canEdit &&
                (isEditing ? (
                  <div className="flex flex-wrap gap-3 self-end">
                    <button
                      className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#F0F2F5] px-4"
                      onClick={onPressEditCancel}
                    >
                      <p className="flex flex-row items-center gap-x-1 text-sm font-medium leading-normal text-[#141414]">
                        <MdCancel /> 취소
                      </p>
                    </button>
                    <button
                      className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#F0F2F5] px-4"
                      onClick={onPressEditConfirm}
                    >
                      <p className="flex flex-row items-center gap-x-1 text-sm font-medium leading-normal text-[#141414]">
                        <MdCheckCircle /> 완료
                      </p>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3 self-end">
                    <button
                      className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#F0F2F5] px-4"
                      onClick={onPressEdit}
                    >
                      <p className="flex flex-row items-center gap-x-1 text-sm font-medium leading-normal text-[#141414]">
                        <MdModeEdit /> 수정
                      </p>
                    </button>
                    <button
                      className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#F0F2F5] px-4"
                      onClick={onPressDelete}
                    >
                      <p className="flex flex-row items-center gap-x-1 text-sm font-medium leading-normal text-[#141414]">
                        <MdDelete />
                        삭제
                      </p>
                    </button>
                  </div>
                ))}
            </div>
            {isEditing ? (
              <div className="p-4">
                <div className="flex items-stretch justify-between gap-4 rounded-xl bg-[#FFFFFF] p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
                  <div className="flex flex-[2_2_0px] flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex min-w-40 flex-1 flex-col">
                          <input
                            placeholder="Title"
                            className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#EEEEEE] p-4 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </label>
                      </div>
                      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex min-w-40 flex-1 flex-col">
                          <textarea
                            placeholder="Write your post..."
                            className="form-input flex min-h-36 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#EEEEEE] p-4 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                          ></textarea>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-stretch justify-between gap-4 rounded-xl bg-[#FFFFFF] p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
                  <div className="flex flex-[2_2_0px] flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-base font-bold leading-tight text-[#141414]">
                        {post.title}
                      </p>
                      <p className="text-sm font-normal leading-normal text-[#3E4D5B]">
                        {post.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-4 px-4 py-2">
              <div className="flex items-center justify-center gap-2 px-3 py-2">
                <div
                  className="text-[#3E4D5B]"
                  data-icon="Eye"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                  </svg>
                </div>
                <p className="text-[13px] font-bold leading-normal tracking-[0.015em] text-[#3E4D5B]">
                  {post.viewCount > 1
                    ? `${post.viewCount} views`
                    : `${post.viewCount} view`}
                </p>
              </div>
              <button
                className="flex items-center justify-center gap-2 px-3 py-2"
                onClick={onPressLike}
              >
                <div
                  className="text-[#3E4D5B]"
                  data-icon="ThumbsUp"
                  data-size="24px"
                  data-weight="regular"
                >
                  {canLike ? <BiLike size={24} /> : <BiSolidLike size={24} />}
                </div>
                <p className="text-[13px] font-bold leading-normal tracking-[0.015em] text-[#3E4D5B]">
                  {post.likeCount > 1
                    ? `${post.likeCount} likes`
                    : `${post.likeCount} like`}
                </p>
              </button>
              <div className="flex items-center justify-center gap-2 px-3 py-2">
                <div
                  className="text-[#3E4D5B]"
                  data-icon="Bookmark"
                  data-size="24px"
                  data-weight="regular"
                >
                  <FaRegCommentAlt />
                </div>
                <p className="text-[13px] font-bold leading-normal tracking-[0.015em] text-[#3E4D5B]">
                  {post.commentCount > 1
                    ? `${post.commentCount} comments`
                    : `${post.commentCount} comment`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
