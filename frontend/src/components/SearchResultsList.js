import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Tooltip } from '@mui/material'
import moment from 'moment'
import { Link } from 'react-router-dom'
import LoadingSkeletons from '../components/LoadingSkeletons'
import {
  defaultNFTCollectionsLimit,
  collectionTypeLabelColors,
  defaultAssetsLimit,
  MINTING_STATUSES,
} from '../lib/dataConstants'

function SearchResultsList({ nftCollections, assets, searching }) {
  return (
    <>
      {nftCollections?.length > 0 && (
        <Container sx={{ py: 0 }} width="lg">
          <Typography component="h4" variant="h4" align="left" color="text.primary" gutterBottom>
            NFT Collection Results
          </Typography>
        </Container>
      )}

      {searching ? (
        <LoadingSkeletons cardsCount={defaultNFTCollectionsLimit / 2} name="nftCollection" />
      ) : (
        nftCollections?.length > 0 && (
          <Container sx={{ mb: 5 }}>
            <Grid container spacing={4}>
              {nftCollections.map((nftCollection) => (
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
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Container>
        )
      )}

      {assets?.length > 0 && (
        <Container sx={{ py: 0 }} width="lg">
          <Typography component="h4" variant="h4" align="left" color="text.primary" gutterBottom>
            Asset Results
          </Typography>
        </Container>
      )}
      {searching ? (
        <LoadingSkeletons cardsCount={defaultAssetsLimit / 2} name="asset" />
      ) : (
        assets?.length > 0 && (
          <Container sx={{ mb: 5 }}>
            <Grid container spacing={4}>
              {assets.map((asset) => (
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
                        {asset.tokenDetails?.mintingStatus === MINTING_STATUSES.minted && (
                          <Tooltip title="minted as NFT" arrow={true} placement="right">
                            <CheckCircleIcon color="success" sx={{ fontSize: 25 }} />
                          </Tooltip>
                        )}
                        <Typography variant="p" component="p">
                          {moment(asset.publishedAt).format('Do MMMM YYYY')}{' '}
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
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Container>
        )
      )}
    </>
  )
}

export default SearchResultsList
