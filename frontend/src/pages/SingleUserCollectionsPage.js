import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import TopSlogan from '../components/TopSlogan'
import NFTCollectionsList from '../components/NFTCollectionsList'
import axiosClient from '../lib/axiosClient'

function SingleUserCollectionsPage() {
  const { userId } = useParams()

  return <NFTCollectionsList userId={userId} />
}

export default SingleUserCollectionsPage
