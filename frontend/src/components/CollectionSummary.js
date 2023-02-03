import { useContext } from 'react'
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import ActionConfirm from '../components/ActionConfirm'
import { collectionTypeLabelColors } from '../lib/dataConstants'
import AlertMessageContext from '../lib/AlertMessageContext'
import axiosClient from '../lib/axiosClient'

function CollectionSummary({
  user,
  nftCollection,
  loading,
  enableBannerImage = true,
  enableEdit = false,
}) {
  const navigate = useNavigate()
  const { setAlert } = useContext(AlertMessageContext)

  const handleDelete = (id) => {
    axiosClient
      .delete(`/nftCollections/${id}`)
      .then((response) => {
        const message = 'The NFT collection has been deleted successfully!'
        console.log(message)
        setAlert({ message })
        navigate(-1)
      })
      .catch((error) => {
        const message = `Delte NFT collection failed: ${error.message}`
        console.error(message)
        setAlert({ message, severity: 'error' })
      })
  }

  return (
    <>
      {loading && <CircularProgress />}
      {nftCollection && (
        <>
          {enableBannerImage && (
            <img src={nftCollection.bannerImageUrl} alt="banner" width="100%" height="300px" />
          )}
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
                {enableEdit && user?._id === nftCollection.userId && (
                  <Box>
                    <Link
                      style={{ textDecoration: 'none' }}
                      to={`/collections/${nftCollection._id}/edit`}
                    >
                      <Button size="small" variant="contained" color="info">
                        Edit
                      </Button>
                    </Link>{' '}
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
                    />
                  </Box>
                )}
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
    </>
  )
}

export default CollectionSummary
