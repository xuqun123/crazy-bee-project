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
import { defaultAssetsLimit } from '../lib/dataConstants'

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

function AssetsList({ nftCollectionId, enableLoadMore, enableSearch }) {
  const [assets, setAssets] = useState([])
  const [loadMore, setLoadMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = (offset = 0) => {
    let url = `/assets?limit=${defaultAssetsLimit}&offset=${offset}`
    if (nftCollectionId) url = `${url}&nftCollectionId=${nftCollectionId}`

    axiosClient
      .get(url)
      .then((response) => {
        const { data, loadMore: loadMoreFlag, offset: offsetNumber } = response?.data

        setLoading(false)
        setOffset(offsetNumber)
        setAssets(assets.concat(data))
        setLoadMore(loadMoreFlag)
      })
      .catch((error) => {
        setLoading(false)
        const message = `Get assets data failed: ${error.message}`
        console.error(message)
      })
  }

  const handleLoadMore = () => {
    loadData(offset + defaultAssetsLimit)
  }

  return (
    <Container sx={{ py: 0 }} width="lg">
      {enableSearch && <PageSearchBar placeholder={'Search assets'} />}
      <Grid container spacing={4}>
        {loading ? (
          <LoadingSkeletons />
        ) : (
          assets.map((asset) => (
            <Grid item key={asset._id} xs={12} sm={4} md={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  ':hover': {
                    boxShadow: 5,
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardMedia component="img" image={asset.coverImageUrl} alt="random" />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="p" component="p">
                    {moment(asset.publishedAt).format('Do MMMM YYYY')}
                  </Typography>
                  <Typography gutterBottom variant="h5" component="h2">
                    {asset.name}
                  </Typography>
                  <Typography>{asset.summary}</Typography>
                  <Chip sx={{ mt: 1 }} label={asset.assetType} />
                </CardContent>
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

export default AssetsList
