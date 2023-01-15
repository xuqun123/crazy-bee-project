import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import moment from 'moment'

import Skeleton from '@mui/material/Skeleton'
import axiosClient from '../lib/axiosClient'

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

function NFTCollectionsList() {
  const [nftCollections, setNFTCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient
      .get('/nftCollections?limit=12')
      .then((response) => {
        setLoading(false)
        setNFTCollections(response?.data?.data || [])
      })
      .catch((error) => {
        setLoading(false)
        const message = `Get nftCollections data failed: ${error.message}`
        console.error(message)
      })
  }, [])

  return (
    <Container sx={{ py: 0 }} width="lg">
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
                <CardActions>
                  <Button size="small">View</Button>
                  <Button size="small">Edit</Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  )
}

export default NFTCollectionsList
