import Header from 'components/Header'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { MyCommentResponse, PostResponse, Post as PostType } from 'types'
import { IoMdPerson } from 'react-icons/io'
import { FaCalendar, FaRegCommentAlt } from 'react-icons/fa'
import { MdModeEdit, MdDelete, MdCancel, MdCheckCircle } from 'react-icons/md'
import { BiLike, BiSolidLike } from 'react-icons/bi'
import { IoSend } from 'react-icons/io5'
import useDeletePost from 'hooks/useDeletePost'
import useEditPost from 'hooks/useEditPost'
import getPost from 'api/getPost'
import useMyPosts from 'hooks/useMyPosts'
import useMyLike from 'hooks/useMyLike'
import useLike from 'hooks/useLike'
import ProfileImage from 'components/ProfileImage'
import useMyComments from 'hooks/useMyComments'
import useDeleteComment from 'hooks/useDeleteComment'
import useCreateComment from 'hooks/useCreateComment'
import useEditComment from 'hooks/useEditComment'
import Unauthorized from './Unauthorized'
import useAuth from 'hooks/useAuth'
import useMe from 'hooks/useMe'

const Post = () => {
  const loaderData = useLoaderData() as PostResponse
  const [post, setPost] = useState(loaderData)
  const [isEditingPost, setIsEditingPost] = useState(false)
  const [isEditingComment, setIsEditingComment] = useState(false)
  const [editCommentId, setEditCommentId] = useState<number | null>(null)
  const [editCommentContent, setEditCommentContent] = useState('')
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [commentContent, setCommentContent] = useState('')
  const [myPosts, setMyPosts] = useState<PostType[]>([])
  const [myLikePosts, setMyLikePosts] = useState<PostType[]>([])
  const [myComments, setMyComments] = useState<MyCommentResponse[]>([])
  const { userData } = useMe()
  const { deletePost } = useDeletePost()
  const { editPost } = useEditPost()
  const { likePost, dislikePost } = useLike()
  const { createComment } = useCreateComment()
  const { editComment } = useEditComment()
  const { deleteComment } = useDeleteComment()
  const { fetchMyPosts, isLoaded: myPostsLoaded } = useMyPosts()
  const { fetchMyLikes, isLoaded: myLikePostsLoaded } = useMyLike()
  const { fetchMyComments, isLoaded: myCommentsLoaded } = useMyComments()
  const { isAuthorized } = useAuth()
  const navigate = useNavigate()
  const canEditPost = useMemo(
    () => myPosts.some((myPost) => myPost.id === post.id),
    [myPosts, post.id]
  )
  const canLike = useMemo(
    () => !myLikePosts.some((myLikePost) => myLikePost.id === post.id),
    [myLikePosts, post.id]
  )
  const getCanEditComment = useCallback(
    (commentId: number) => {
      return myComments.some((myComment) => myComment.comments.id === commentId)
    },
    [myComments]
  )

  useEffect(() => {
    setPost(loaderData)
  }, [loaderData])
  useEffect(() => {
    if (!myPostsLoaded) {
      fetchMyPosts().then((posts) => {
        setMyPosts(posts)
      })
    }
    if (!myLikePostsLoaded) {
      fetchMyLikes().then((posts) => {
        setMyLikePosts(posts)
      })
    }
    if (!myCommentsLoaded) {
      fetchMyComments().then((comments) => {
        setMyComments(comments)
      })
    }
  }, [
    fetchMyPosts,
    fetchMyLikes,
    fetchMyComments,
    myPostsLoaded,
    myLikePostsLoaded,
    myCommentsLoaded
  ])

  const onPressEditPost = () => {
    setIsEditingPost(true)
  }
  const onPressEditCancelPost = () => {
    setIsEditingPost(false)
  }
  const onPressEditConfirmPost = async () => {
    await editPost(`${post.id}`, title, content)
    const data = await getPost(`${post.id}`)
    setPost(data)
    setIsEditingPost(false)
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
  const onPressCreateComment = async () => {
    if (commentContent === '' || !userData) {
      return
    }
    const commentId = await createComment(`${post.id}`, commentContent)
    const comment = {
      id: commentId,
      content: commentContent,
      writer: userData,
      createdDate: new Date()
    }
    setMyComments((prev) => [
      ...prev,
      {
        ...post,
        comments: comment
      }
    ])
    setPost((prev) => ({
      ...prev,
      commentCount: prev.commentCount + 1,
      comments: [...prev.comments, comment]
    }))
    setCommentContent('')
  }
  const onPressEditComment = (commentId: number) => {
    setEditCommentId(commentId)
    setEditCommentContent(
      post.comments.find((comment) => comment.id === commentId)!.content
    )
    setIsEditingComment(true)
  }
  const onPressEditCancelComment = () => {
    setEditCommentId(null)
    setIsEditingComment(false)
  }
  const onPressEditConfirmComment = async () => {
    await editComment(`${editCommentId}`, editCommentContent)
    setPost((prev) => ({
      ...prev,
      comments: prev.comments.map((comment) =>
        `${comment.id}` === `${editCommentId}`
          ? { ...comment, content: editCommentContent }
          : comment
      )
    }))
    setIsEditingComment(false)
  }
  const onPressDeleteComment = async (commentId: string) => {
    await deleteComment(commentId)
    setPost((prev) => ({
      ...prev,
      commentCount: prev.commentCount - 1,
      comments: prev.comments.filter((comment) => `${comment.id}` !== commentId)
    }))
    setMyComments((prev) =>
      prev.filter((comment) => `${comment.id}` !== commentId)
    )
  }

  if (!isAuthorized) {
    return <Unauthorized />
  }

  return (
    <div
      className="group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden bg-[#FFFFFF]"
      style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}
    >
      <div className="  flex h-full grow flex-col">
        <Header />
        <div className="flex flex-1 justify-center px-40 py-5">
          <div className=" flex max-w-[960px] flex-1 flex-col">
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
              {canEditPost &&
                (isEditingPost ? (
                  <div className="flex flex-wrap gap-3 self-end">
                    <button
                      className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#F0F2F5] px-4"
                      onClick={onPressEditCancelPost}
                    >
                      <p className="flex flex-row items-center gap-x-1 text-sm font-medium leading-normal text-[#141414]">
                        <MdCancel /> 취소
                      </p>
                    </button>
                    <button
                      className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#F0F2F5] px-4"
                      onClick={onPressEditConfirmPost}
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
                      onClick={onPressEditPost}
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
            {isEditingPost ? (
              <div className="p-4">
                <div className="flex items-stretch justify-between gap-4 rounded-xl bg-[#FFFFFF] p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
                  <div className="flex flex-[2_2_0px] flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex min-w-40 flex-1 flex-col">
                          <input
                            placeholder="Title"
                            className=" flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#EEEEEE] p-4 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </label>
                      </div>
                      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex min-w-40 flex-1 flex-col">
                          <textarea
                            placeholder="Write your post..."
                            className=" flex min-h-36 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#EEEEEE] p-4 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
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
            <h2 className="px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-black">
              댓글
            </h2>
            {post.comments.map((comment) => {
              return (
                <div className="flex gap-3 p-4" key={comment.id}>
                  <ProfileImage name={comment.writer.name} />
                  <div className="flex flex-1 flex-col items-stretch gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-base font-bold leading-tight text-black">
                          {comment.writer.name}
                        </p>
                        <p className="text-sm font-normal leading-normal text-[#6B6B6B]">
                          {moment(comment.createdDate).fromNow()}
                        </p>
                      </div>
                      {isEditingComment && editCommentId === comment.id ? (
                        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4">
                          <label className="flex min-w-40 flex-1 flex-col">
                            <input
                              placeholder="Edit comment"
                              className=" flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#EEEEEE] p-4 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
                              value={editCommentContent}
                              onChange={(e) =>
                                setEditCommentContent(e.target.value)
                              }
                            />
                          </label>
                        </div>
                      ) : (
                        <p className="text-base font-normal leading-normal text-black">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  </div>
                  {getCanEditComment(comment.id) &&
                    (isEditingComment && editCommentId === comment.id ? (
                      <div className="flex flex-wrap gap-3 self-end">
                        <button
                          className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#F0F2F5] px-4"
                          onClick={onPressEditCancelComment}
                        >
                          <p className="flex flex-row items-center gap-x-1 text-sm font-medium leading-normal text-[#141414]">
                            <MdCancel /> 취소
                          </p>
                        </button>
                        <button
                          className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#F0F2F5] px-4"
                          onClick={() => onPressEditConfirmComment()}
                        >
                          <p className="flex flex-row items-center gap-x-1 text-sm font-medium leading-normal text-[#141414]">
                            <MdCheckCircle /> 완료
                          </p>
                        </button>
                      </div>
                    ) : isEditingComment ? null : (
                      <div className="flex flex-wrap gap-3 self-end">
                        <button
                          className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#F0F2F5] px-4"
                          onClick={() => onPressEditComment(comment.id)}
                        >
                          <p className="flex flex-row items-center gap-x-1 text-sm font-medium leading-normal text-[#141414]">
                            <MdModeEdit /> 수정
                          </p>
                        </button>
                        <button
                          className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#F0F2F5] px-4"
                          onClick={() => onPressDeleteComment(`${comment.id}`)}
                        >
                          <p className="flex flex-row items-center gap-x-1 text-sm font-medium leading-normal text-[#141414]">
                            <MdDelete />
                            삭제
                          </p>
                        </button>
                      </div>
                    ))}
                </div>
              )
            })}
            <div
              className="flex items-center gap-3 px-4 py-3"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onPressCreateComment()
                }
              }}
            >
              <ProfileImage name={userData?.name ?? post.writer.name} />
              <label className="flex h-12 min-w-40 flex-1 flex-col">
                <div className="flex size-full flex-1 items-stretch rounded-xl">
                  <input
                    placeholder="Add a comment..."
                    className=" flex size-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl rounded-r-none border-r-0 border-none bg-[#EEEEEE] px-4 pr-2 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                  <div className="flex items-center justify-center rounded-r-xl border-l-0 border-none bg-[#EEEEEE] !pr-2">
                    <div className="flex items-center justify-end gap-4">
                      <div className="flex items-center gap-1">
                        <button
                          className="flex items-center justify-center p-1.5"
                          onClick={onPressCreateComment}
                        >
                          <div
                            className="text-[#6B6B6B]"
                            data-icon="Smiley"
                            data-size="20px"
                            data-weight="regular"
                          >
                            <IoSend />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
