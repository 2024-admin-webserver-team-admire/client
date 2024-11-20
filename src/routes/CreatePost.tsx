import Header from 'components/Header'
import useAuth from 'hooks/useAuth'
import React, { useState } from 'react'
import Unauthorized from './Unauthorized'
import useCreatePost from 'hooks/useCreatePost'
import { useNavigate } from 'react-router-dom'

export default function CreatePost() {
  const { isAuthorized } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const { createPost } = useCreatePost()
  const navigate = useNavigate()

  const handleCreatePost = async () => {
    await createPost(title, content)
    navigate('/posts')
  }

  if (!isAuthorized) {
    return <Unauthorized />
  }
  return (
    <div
      className="group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden bg-[#FFFFFF]"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <Header />
      <div className="  flex h-full grow flex-col">
        <div className="flex flex-1 justify-center px-40 py-5">
          <div className="flex w-[512px] max-w-[512px] flex-1 flex-col py-5">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="  min-w-72 text-[32px] font-bold leading-tight text-black">
                New post
              </p>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex min-w-40 flex-1 flex-col">
                <input
                  placeholder="Title"
                  className="  flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#EEEEEE] p-4 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex min-w-40 flex-1 flex-col">
                <textarea
                  placeholder="Write your post..."
                  className="  flex min-h-36 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#EEEEEE] p-4 text-base font-normal leading-normal text-black placeholder:text-[#6B6B6B] focus:border-none focus:outline-0 focus:ring-0"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </label>
            </div>
            <div className="flex justify-stretch">
              <div className="flex flex-1 flex-wrap justify-end gap-3 px-4 py-3">
                <button
                  className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-black px-4 text-sm font-bold leading-normal tracking-[0.015em] text-[#FFFFFF]"
                  onClick={handleCreatePost}
                >
                  <span className="truncate">작성</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
