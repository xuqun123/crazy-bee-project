import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Skeleton from '@mui/material/Skeleton'
import moment from 'moment'
import PageSearchBar from '../components/PageSearchBar'
import axiosClient from '../lib/axiosClient'
import { defaultNFTCollectionsLimit } from '../lib/dataConstants'

function LoadingSkeletons() {
  return (
    <>
      <Skeleton animation="wave" sx={{ height: '50px' }}></Skeleton>
      <Skeleton animation="wave" sx={{ height: '50px' }}></Skeleton>
      <Skeleton animation="wave" sx={{ height: '50px' }}></Skeleton>
      <Skeleton animation="wave" sx={{ height: '50px' }}></Skeleton>
      <Skeleton animation="wave" sx={{ height: '50px' }}></Skeleton>
      <Skeleton animation="wave" sx={{ height: '50px' }}></Skeleton>
      <Skeleton animation="wave" sx={{ height: '50px' }}></Skeleton>
      <Skeleton animation="wave" sx={{ height: '50px' }}></Skeleton>
      <Skeleton animation="wave" sx={{ height: '50px' }}></Skeleton>
    </>
  )
}

function NFTCollectionsList({ userId, enableLoadMore, enableSearch }) {
  const [nftCollections, setNFTCollections] = useState([])
  const [loadMore, setLoadMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = (offset = 0) => {
    let url = `/nftCollections?limit=${defaultNFTCollectionsLimit}&offset=${offset}`
    if (userId) url = `${url}&userId=${userId}`

    axiosClient
      .get(url)
      .then((response) => {
        const { data, loadMore: loadMoreFlag, offset: offsetNumber } = response?.data

        setLoading(false)
        setOffset(offsetNumber)
        setNFTCollections(nftCollections.concat(data))
        setLoadMore(loadMoreFlag)
      })
      .catch((error) => {
        setLoading(false)
        const message = `Get nftCollections data failed: ${error.message}`
        console.error(message)
      })
  }

  const handleLoadMore = () => {
    loadData(offset + defaultNFTCollectionsLimit)
  }

  return (
    <Container sx={{ py: 0 }} width="lg">
      {enableSearch && <PageSearchBar />}
      <Grid container spacing={4}>
        {loading ? (
          <LoadingSkeletons />
        ) : (
          nftCollections.map((nftCollection) => (
            <Grid item key={nftCollection._id} xs={12} sm={4} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia component="img" image={nftCollection.coverImageUrl} alt="random" />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="p" component="p">
                    {moment(nftCollection.publishedAt).format('Do MMMM YYYY')}
                  </Typography>
                  <Typography gutterBottom variant="h5" component="h2">
                    {nftCollection.name}
                  </Typography>
                  <Typography>{nftCollection.summary}</Typography>
                  <Chip sx={{ mt: 1 }} label={nftCollection.collectionType} />
                </CardContent>
                {/* <CardActions>
                  <Button size="small">View</Button>
                  <Button size="small">Edit</Button>
                </CardActions> */}
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      {enableLoadMore && loadMore && (
        <Button
          data-testid="load-more-btn"
          variant="contained"
          sx={{ mt: 4 }}
          onClick={handleLoadMore}
        >
          Load More
        </Button>
      )}
    </Container>
  )
}

export default NFTCollectionsList
