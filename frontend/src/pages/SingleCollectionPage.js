import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import AssetsList from '../components/AssetsList'
import axiosClient from '../lib/axiosClient'
import CurrentUserContext from '../lib/CurrentUserContext'
import CollectionSummary from '../components/CollectionSummary'

function SingleCollectionPage() {
  const { nftCollectionId } = useParams()
  const [nftCollection, setNFTCollection] = useState(null)
  const [loading, setLoading] = useState(true)
  const currentUser = useContext(CurrentUserContext)

  useEffect(() => {
    axiosClient
      .get(`/nftCollections/${nftCollectionId}`)
      .then((response) => {
        setLoading(false)
        setNFTCollection(response?.data?.data)
      })
      .catch((error) => {
        setLoading(false)
        const message = `Get nftCollection data failed: ${error.message}`
        console.error(message)
      })
  }, [nftCollectionId])

  return (
    <>
      <CollectionSummary
        user={currentUser}
        nftCollection={nftCollection}
        loading={loading}
        enableEdit={currentUser && currentUser._id === nftCollection?.userId}
      />
      <AssetsList
        nftCollectionId={nftCollectionId}
        enableLoadMore={true}
        enableSearch={true}
        enableCreate={currentUser && currentUser._id === nftCollection?.userId}
        enableEdit={currentUser && currentUser._id === nftCollection?.userId}
      />
    </>
  )
}

export default SingleCollectionPage
