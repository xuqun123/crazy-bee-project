import * as React from 'react'
import TopSlogan from '../components/TopSlogan'
import NFTCollectionsList from '../components/NFTCollectionsList'

function HomePage() {
  return (
    <>
      <TopSlogan
        header="#1 NFT Marketplace in Australia"
        summary="Do you want to connect your crypto wallet, list your existing NFTs, create and mint your
          own NFTs for free? We have all these features covered for you!"
        mainCTAText="Explore more NFTs"
        secondaryCTA="Signup Now"
      />
      <NFTCollectionsList />
    </>
  )
}

export default HomePage
