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
// import UserProfilePage from './pages/UserProfilePage'
import PasswordEmailLinkPage from './pages/PasswordEmailLinkPage'
import PasswordResetPage from './pages/PasswordResetPage'
import SingleUserCollectionsPage from './pages/SingleUserCollectionsPage'
import SingleCollectionPage from './pages/SingleCollectionPage'
import SingleAssetPage from './pages/SingleAssetPage'
import NewCollectionPage from './pages/NewCollectionPage'

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
        path: 'users/:userId/collections/new',
        element: <NewCollectionPage />,
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
      // {
      //   path: 'user-profile',
      //   element: <UserProfilePage />,
      //   errorElement: <ErrorPage />,
      // },
      {
        path: 'passwordEmailLink',
        element: <PasswordEmailLinkPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'passwordReset',
        element: <PasswordResetPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'collections/:nftCollectionId',
        element: <SingleCollectionPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'assets/:assetId',
        element: <SingleAssetPage />,
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
