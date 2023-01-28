import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import moment from 'moment'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import AssetsList from '../components/AssetsList'
import axiosClient from '../lib/axiosClient'
import { collectionTypeLabelColors } from '../lib/dataConstants'

function SingleCollectionPage() {
  const { nftCollectionId } = useParams()
  const [nftCollection, setNFTCollection] = useState(null)
  const [loading, setLoading] = useState(true)

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
      {loading && <CircularProgress />}
      {nftCollection && (
        <>
          <img src={nftCollection.bannerImageUrl} alt="banner" width="100%" height="300px" />

          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ px: 5, mt: { xs: 2, md: 5 } }}
          >
            <Grid
              item
              md={4}
              xs={12}
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-end' },
                pr: { md: 5, xs: 0 },
              }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  height: { xs: 300, md: 300, lg: 300 },
                  width: { xs: 300, md: 300, lg: 300 },
                  mx: 0,
                }}
                alt={`avatar-${nftCollection.nftCollectionname}`}
                src={nftCollection.coverImageUrl}
              />
            </Grid>
            <Grid item md={8} xs={12}>
              <Typography
                component="h3"
                variant="h3"
                align="left"
                color="text.primary"
                sx={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}
              >
                {nftCollection.name}
                <Link
                  style={{ textDecoration: 'none' }}
                  to={`/collections/${nftCollectionId}/edit`}
                  state={{ userId: nftCollection.userId }}
                >
                  <Button size="small" variant="contained" color="info">
                    Edit
                  </Button>
                </Link>
              </Typography>

              <Typography
                component="h5"
                variant="h5"
                align="left"
                color="text.primary"
                sx={{ fontWeight: 'bold' }}
              >
                <Typography component="span" variant="h5" align="left" color="grey">
                  Published{' '}
                </Typography>
                {moment(nftCollection.publishedAt).format('DD MMM YYYY')}
                <Typography component="span" align="left" sx={{ ml: 1, verticalAlign: 'top' }}>
                  {nftCollection.collectionTypes.map((collectionType) => (
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
                </Typography>
              </Typography>

              <br />

              <Typography component="h5" variant="h5" align="left" color="text.primary">
                {nftCollection.summary}
              </Typography>
              <br />
              <Typography component="h6" variant="h6" align="left" color="grey">
                {nftCollection.description}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
      <AssetsList nftCollectionId={nftCollectionId} enableLoadMore={true} enableSearch={true} />
    </>
  )
}

export default SingleCollectionPage
