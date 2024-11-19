import useAuth from 'hooks/useAuth'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Unauthorized from './Unauthorized'
import Header from 'components/Header'
import useGetPosts from 'hooks/useGetPosts'
import { Post } from 'types'
import moment from 'moment'
import { Link } from 'react-router-dom'
import ProfileImage from 'components/ProfileImage'

export default function Posts() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loadedPage, setLoadedPage] = useState(-1)
  const [lastLoadedPage, setLastLoadedPage] = useState(-1)
  const { isAuthorized } = useAuth()
  const { getPosts, getMorePosts } = useGetPosts()

  useEffect(() => {
    if (isAuthorized && !isLoaded && !isLoading) {
      setIsLoading(true)
      getPosts().then((value) => {
        setPosts(value.content)
        setLoadedPage(value.currentPage)
        setIsLoading(false)
        setIsLoaded(true)
      })
    }
  }, [getPosts, isAuthorized, isLoaded, isLoading])

  const loadMore = useCallback(() => {
    if (lastLoadedPage !== loadedPage && !isLoading) {
      setIsLoading(true)
      getMorePosts(loadedPage + 1).then((value) => {
        if (value.content.length > 0) {
          setPosts((prev) => [...prev, ...value.content])
        } else {
          setLastLoadedPage(value.currentPage)
        }
        setLoadedPage(value.currentPage)
        setIsLoading(false)
      })
    }
  }, [getMorePosts, isLoading, loadedPage, lastLoadedPage])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && isLoaded) {
          loadMore()
        }
      },
      { threshold: 1.0 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [isLoaded, loadMore, loadMoreRef])

  if (!isAuthorized) {
    return <Unauthorized />
  }

  return (
    <div
      className="group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden bg-[#FFFFFF]"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <Header />
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center px-40 py-5">
          <div className="layout-content-container flex max-w-[960px] flex-1 flex-col">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="min-w-72 text-4xl font-black leading-tight tracking-[-0.033em] text-black">
                Posts
              </p>
            </div>
            {isLoaded && posts.length === 0 ? (
              <></>
            ) : (
              <>
                {posts.map((post, index) => {
                  return (
                    <div key={post.id}>
                      <Link
                        to={`/posts/${post.id}`}
                        className="flex min-h-[72px] items-center justify-between gap-4 bg-[#FFFFFF] px-4 py-2"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-4">
                            <ProfileImage name={post.writer.name} />
                            <div className="font-medium dark:text-black">
                              <div>Writer</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {post.writer.name}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-center">
                            <p className="line-clamp-1 text-base font-medium leading-normal text-black">
                              {post.title}
                            </p>
                            <p className="line-clamp-2 text-sm font-normal leading-normal text-[#6B6B6B]">
                              {post.commentCount > 1
                                ? `${post.commentCount} comments`
                                : `${post.commentCount} comment`}{' '}
                              · {moment(post.createdDate).format('YYYY-MM-DD')}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-row gap-4">
                          <p className="text-base font-normal leading-normal text-black">
                            {post.likeCount > 1
                              ? `${post.likeCount} likes`
                              : `${post.likeCount} like`}
                          </p>
                          <p className="text-base font-normal leading-normal text-black"></p>

                          <p className="text-base font-normal leading-normal text-black">
                            {post.viewCount > 1
                              ? `${post.viewCount} views`
                              : `${post.viewCount} view`}
                          </p>
                        </div>
                      </Link>
                      {index !== posts.length - 1 && (
                        <div className="h-px w-full bg-[#E0E0E0]"></div>
                      )}
                    </div>
                  )
                })}
                <div ref={loadMoreRef}></div>
              </>
            )}
            {isLoading && (
              <div className="text-center">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline size-8 animate-spin fill-red-600 text-gray-200 dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
