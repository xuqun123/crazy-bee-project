import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import NFTCollectionsList from '../components/NFTCollectionsList'
import axiosClient from '../lib/axiosClient'
import UserSummary from '../components/UserSummary'

function SingleUserCollectionsPage() {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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
      <UserSummary userId={userId} user={user} loading={loading} enableCreate={true} />
      <NFTCollectionsList
        userId={userId}
        enableLoadMore={true}
        enableSearch={true}
        enableEdit={true}
        enableDelete={true}
      />
    </>
  )
}

export default SingleUserCollectionsPage
