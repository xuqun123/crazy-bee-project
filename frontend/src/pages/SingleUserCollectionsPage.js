import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import NFTCollectionsList from '../components/NFTCollectionsList'
import axiosClient from '../lib/axiosClient'
import CurrentUserContext from '../lib/CurrentUserContext'
import UserSummary from '../components/UserSummary'

function SingleUserCollectionsPage() {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const currentUser = useContext(CurrentUserContext)

  useEffect(() => {
    axiosClient
      .get(`/users/${userId}`)
      .then((response) => {
        setLoading(false)
        setUser(response?.data?.data)
      })
      .catch((error) => {
        setLoading(false)
        const message = `Get nftCollections data failed: ${error.message}`

        console.error(message)
      })
  }, [userId])

  return (
    <>
      <UserSummary
        userId={userId}
        user={user}
        loading={loading}
        enableCreate={currentUser && currentUser._id === userId}
      />
      <NFTCollectionsList
        userId={userId}
        enableLoadMore={true}
        enableSearch={true}
        enableEdit={currentUser && currentUser._id === userId}
        enableDelete={currentUser && currentUser._id === userId}
      />
    </>
  )
}

export default SingleUserCollectionsPage
