import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import TokenIcon from '@mui/icons-material/Token'
import CircularProgress from '@mui/material/CircularProgress'
import NFTCollectionsList from '../components/NFTCollectionsList'
import axiosClient from '../lib/axiosClient'

function SingleUserCollectionsPage() {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient
      .get(`/users/${userId}`)
      .then((response) => {
        setLoading(false)
        setUser(response?.data?.data)
      })
      .catch((error) => {
        setLoading(false)
        const message = `Get nftCollections data failed: ${error.message}`
        console.error(message)
      })
  }, [userId])

  return (
    <>
      {loading && <CircularProgress />}
      {user && (
        <>
          <img src={user.bannerImageUrl} alt="banner" width="100%" height="300px" />

          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            sx={{ px: { xs: 3, md: 2, lg: 30 }, mt: { xs: 2, md: 5 } }}
          >
            <Grid item md={4} xs={12}>
              <Avatar
                sx={{
                  height: { xs: 300, md: 300, lg: 250 },
                  width: { xs: 300, md: 300, lg: 250 },
                  mx: 'auto',
                }}
                alt={`avatar-${user.username}`}
                src={user.avatarUrl}
              />
            </Grid>
            <Grid item md={8} xs={12}>
              <Typography component="h3" variant="h3" align="left" color="text.primary">
                {user.username}
              </Typography>
              <Typography
                component="h5"
                variant="h5"
                align="left"
                color="grey"
                sx={{ fontWeight: 'bold' }}
              >
                <TokenIcon color="primary" sx={{ pb: '3px', mr: '1px', verticalAlign: 'middle' }} />
                {user.walletAddresses?.length > 0
                  ? `0x${user.walletAddresses[0]}`
                  : '0x***********'}{' '}
              </Typography>
              <Typography
                component="h5"
                variant="h5"
                align="left"
                color="text.primary"
                sx={{ fontWeight: 'bold' }}
              >
                <Typography component="span" variant="h5" align="left" color="grey">
                  Joined Since{' '}
                </Typography>
                {moment(user.createdAt).format('DD MMM YYYY')}
              </Typography>
              <br />
              <Typography component="h6" variant="h6" align="left" color="grey">
                {user.bio}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
      <NFTCollectionsList userId={userId} enableLoadMore={true} enableSearch={true} />
    </>
  )
}

export default SingleUserCollectionsPage
