import * as React from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import TokenIcon from '@mui/icons-material/Token'
import CircularProgress from '@mui/material/CircularProgress'

function UserSummary({ userId, user, loading, enableBannerImage = true, enableCreate = false }) {
  return (
    <>
      {loading && <CircularProgress />}
      {user && (
        <>
          {enableBannerImage && (
            <img src={user.bannerImageUrl} alt="banner" width="100%" height="300px" />
          )}

          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ px: 5, mt: 2 }}
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
                sx={{
                  height: { xs: 300, md: 300, lg: 250 },
                  width: { xs: 300, md: 300, lg: 250 },
                  mx: 0,
                }}
                alt={`avatar-${user.username}`}
                src={user.avatarUrl}
              />
            </Grid>
            <Grid item md={8} xs={12}>
              <Box display="flex" direction="row" justifyContent="space-between">
                <Typography component="h4" variant="h4" align="left" color="text.primary">
                  @{user.username}
                </Typography>
                <Link style={{ textDecoration: 'none' }} to={`/users/${userId}/collections/new`}>
                  {enableCreate && (
                    <Button
                      data-testid="create-nftcollection-btn"
                      variant="contained"
                      color="success"
                      // onClick={handleLoadMore}
                    >
                      Create
                    </Button>
                  )}
                </Link>
              </Box>
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
    </>
  )
}

export default UserSummary
