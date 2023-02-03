import { useState, useEffect, useContext } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
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
import { defaultAssetsLimit, collectionTypeLabelColors } from '../lib/dataConstants'

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

function AssetsList({
  nftCollectionId,
  userId,
  excludeAssetId,
  enableLoadMore,
  enableSearch,
  enableCreate = false,
  containerStyle,
  enableEdit,
}) {
  const navigate = useNavigate()
  const [assets, setAssets] = useState([])
  const [loadMore, setLoadMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const { setAlert } = useContext(AlertMessageContext)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = (offset = 0, reset = false) => {
    let url = `/assets?limit=${defaultAssetsLimit}&offset=${offset}`
    if (nftCollectionId) url = `${url}&nftCollectionId=${nftCollectionId}`
    if (userId) url = `${url}&userId=${userId}`

    axiosClient
      .get(url)
      .then((response) => {
        const { data, loadMore: loadMoreFlag, offset: offsetNumber } = response?.data

        setLoading(false)
        setOffset(offsetNumber)
        if (reset) setAssets(data)
        else setAssets(assets.concat(data)?.filter((asset) => asset._id !== excludeAssetId))
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

  const handleEditClick = (event, asset) => {
    event.preventDefault()
    navigate(`/collections/${asset.nftCollectionId}/assets/${asset._id}/edit`)
  }

  const handleDelete = (id) => {
    axiosClient
      .delete(`/assets/${id}`)
      .then((response) => {
        const message = 'The Asset has been deleted successfully!'
        console.log(message)
        loadData(0, true)
        setAlert({ message })
      })
      .catch((error) => {
        const message = `Delete Asset failed: ${error.message}`
        console.error(message)
        setAlert({ message, severity: 'error' })
      })
  }

  return (
    <Container sx={{ py: 0 }}>
      <Box display="flex" sx={{ alignItems: 'center' }}>
        {enableSearch && <PageSearchBar placeholder={'Search assets'} />}
        {enableCreate && (
          <Link
            style={{ textDecoration: 'none', marginLeft: '15px' }}
            to={`/collections/${nftCollectionId}/assets/new`}
          >
            <Button size="small" variant="contained" color="success">
              Create New Asset
            </Button>
          </Link>
        )}
      </Box>
      <Grid container spacing={4}>
        {loading ? (
          <LoadingSkeletons />
        ) : (
          assets.map((asset) => (
            <Grid item key={asset._id} xs={12} sm={4} md={3}>
              <Link to={`/assets/${asset._id}`} style={{ textDecoration: 'none' }}>
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
                    <Chip
                      sx={{
                        mt: 1,
                        color: '#fff',
                        backgroundColor: collectionTypeLabelColors[asset.assetType],
                      }}
                      label={asset.assetType}
                    />
                  </CardContent>
                  {enableEdit && (
                    <CardActions sx={{ flexDirection: 'row-reverse', pt: 0 }}>
                      <ActionConfirm
                        variant="contained"
                        size="small"
                        color="error"
                        buttonText={'Delete'}
                        entityName="asset"
                        title="Are you sure to delete this asset?"
                        description="Please be aware there is no turning back! Please cancel this action if this is not what you want."
                        confirmText="Confirm"
                        cancelText="Cancel"
                        confrimAction={() => handleDelete(asset._id)}
                      />
                      <Button
                        sx={{ mr: 1 }}
                        key={asset._id}
                        size="small"
                        variant="contained"
                        color="info"
                        onClick={(e) => handleEditClick(e, asset)}
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

export default AssetsList
