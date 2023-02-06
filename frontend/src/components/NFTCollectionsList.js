import { useState, useEffect, useContext } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Skeleton from '@mui/material/Skeleton'
import moment from 'moment'
import { Link, useNavigate } from 'react-router-dom'
import PageSearchBar from '../components/PageSearchBar'
import ActionConfirm from '../components/ActionConfirm'
import axiosClient from '../lib/axiosClient'
import AlertMessageContext from '../lib/AlertMessageContext'
import { defaultNFTCollectionsLimit, collectionTypeLabelColors } from '../lib/dataConstants'

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

function NFTCollectionsList({
  userId,
  enableLoadMore,
  enableSearch,
  enableEdit,
  nftCollectionsLimit,
}) {
  const navigate = useNavigate()
  const [nftCollections, setNFTCollections] = useState([])
  const [loadMore, setLoadMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const { setAlert } = useContext(AlertMessageContext)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = (offset = 0, reset = false) => {
    let url = `/nftCollections?limit=${
      nftCollectionsLimit || defaultNFTCollectionsLimit
    }&offset=${offset}`
    if (userId) url = `${url}&userId=${userId}`

    axiosClient
      .get(url)
      .then((response) => {
        const { data, loadMore: loadMoreFlag, offset: offsetNumber } = response?.data

        setLoading(false)
        setOffset(offsetNumber)
        if (reset) setNFTCollections(data)
        else setNFTCollections(nftCollections.concat(data))
        setLoadMore(loadMoreFlag)
      })
      .catch((error) => {
        setLoading(false)
        const message = `Get nftCollections data failed: ${error.message}`
        console.error(message)
        setAlert({ message, severity: 'error' })
      })
  }

  const handleLoadMore = () => {
    loadData(offset + (nftCollectionsLimit || defaultNFTCollectionsLimit))
  }

  const handleEditClick = (event, nftCollection) => {
    event.preventDefault()
    navigate(`/collections/${nftCollection._id}/edit`, { state: { userId: nftCollection.userId } })
  }

  const handleDelete = (id) => {
    axiosClient
      .delete(`/nftCollections/${id}`)
      .then((response) => {
        const message = 'The NFT collection has been deleted successfully!'
        console.log(message)
        loadData(0, true)
        setAlert({ message })
      })
      .catch((error) => {
        const message = `Delte NFT collection failed: ${error.message}`
        console.error(message)
        setAlert({ message, severity: 'error' })
      })
  }

  return (
    <Container sx={{ py: 0 }} width="lg">
      {enableSearch && <PageSearchBar placeholder={'Search NFT collections'} />}
      <Grid container spacing={4}>
        {loading ? (
          <LoadingSkeletons />
        ) : (
          nftCollections.map((nftCollection) => (
            <Grid item key={nftCollection._id} xs={12} sm={4} md={3}>
              <Link to={`/collections/${nftCollection._id}`} style={{ textDecoration: 'none' }}>
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
                  <CardMedia
                    component="img"
                    image={nftCollection.coverImageUrl}
                    alt="cover-image"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="p" component="p">
                      {moment(nftCollection.publishedAt).format('Do MMMM YYYY')}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                      {nftCollection.name}
                    </Typography>
                    <Typography>{nftCollection.summary}</Typography>
                    {nftCollection.collectionTypes?.map((collectionType) => (
                      <Chip
                        key={collectionType}
                        sx={{
                          mr: 1,
                          color: '#fff',
                          backgroundColor: collectionTypeLabelColors[collectionType],
                        }}
                        label={collectionType}
                      />
                    ))}
                  </CardContent>
                  {enableEdit && (
                    <CardActions sx={{ flexDirection: 'row-reverse', pt: 0 }}>
                      <ActionConfirm
                        variant="contained"
                        size="small"
                        color="error"
                        buttonText={'Delete'}
                        entityName="nftCollection"
                        title="Are you sure to delete this NFT collection?"
                        description="Please be aware there is no turning back! Please cancel this action if this is not what you want."
                        confirmText="Confirm"
                        cancelText="Cancel"
                        confrimAction={() => handleDelete(nftCollection._id)}
                        // onClick={()=>}
                      />
                      <Button
                        sx={{ mr: 1 }}
                        key={nftCollection._id}
                        size="small"
                        variant="contained"
                        color="info"
                        onClick={(e) => handleEditClick(e, nftCollection)}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Link>
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
