import ErrorPage from 'error-page'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from 'routes/Login'
import Root from 'routes/root'
import SignUp from 'routes/SignUp'
import 'tailwindcss/tailwind.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import CreatePost from 'routes/CreatePost'
import Posts from 'routes/Posts'
import Post from 'routes/Post'
import getPost from 'api/getPost'
import { MyPage } from 'routes/MyPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  {
    path: '/create-post',
    element: <CreatePost />
  },
  {
    path: '/posts',
    element: <Posts />
  },
  {
    path: '/posts/:postId',
    element: <Post />,
    loader: ({ params }) => {
      return getPost(params.postId)
    }
  },
  {
    path: '/mypage',
    element: <MyPage />
  }
])

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </React.StrictMode>
)
