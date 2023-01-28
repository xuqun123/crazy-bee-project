import { useState, useEffect } from 'react'
import axiosClient from './axiosClient'

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    if (localStorage.getItem('jwt')) {
      axiosClient
        .get(`/users/me`)
        .then((response) => {
          setCurrentUser(response?.data)
        })
        .catch((error) => {
          const message = `Cannot get the current user data: ${error.message}`
          console.error(message)
        })
    }
  }, [])

  return [currentUser]
}

export default useCurrentUser
