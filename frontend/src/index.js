import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import App from './App'
import HomePage from './pages/HomePage'
import ErrorPage from './pages/ErrorPage'
import ExplorePage from './pages/ExplorePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import UserProfilePage from './pages/UserProfilePage'
import PasswordPage from './pages/PasswordPage'
import SingleUserCollectionsPage from './pages/SingleUserCollectionsPage'
import SingleCollectionPage from './pages/SingleCollectionPage'

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <HomePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'explore',
        element: <ExplorePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'users/:userId/collections',
        element: <SingleUserCollectionsPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'user-profile',
        element: <UserProfilePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'Password',
        element: <PasswordPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'collections/:nftCollectionId',
        element: <SingleCollectionPage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
const rootRender = root.render(<RouterProvider router={router}></RouterProvider>)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

export { rootRender }
