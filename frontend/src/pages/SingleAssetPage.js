import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import moment from 'moment'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionSummary, AccordionDetails } from '../components/Accordion'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { collectionTypeLabelColors } from '../lib/dataConstants'
import AssetsList from '../components/AssetsList'
import axiosClient from '../lib/axiosClient'

function SingleCollectionPage() {
  const { assetId } = useParams()
  const [asset, setAsset] = useState(null)
  const [user, setUser] = useState(null)
  const [nftCollection, setNFTCollection] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient
      .get(`/assets/${assetId}`)
      .then((response) => {
        setLoading(false)
        setAsset(response?.data?.data)
      })
      .catch((error) => {
        setLoading(false)
        const message = `Get asset data failed: ${error.message}`
        console.error(message)
      })
  }, [assetId])

  useEffect(() => {
    if (asset) {
      axiosClient
        .get(`/users/${asset.userId}`)
        .then((response) => {
          setUser(response?.data?.data)
        })
        .catch((error) => {
          const message = `Get user data failed: ${error.message}`
          console.error(message)
        })

      axiosClient
        .get(`/nftCollections/${asset.nftCollectionId}`)
        .then((response) => {
          setNFTCollection(response?.data?.data)
        })
        .catch((error) => {
          const message = `Get asset data failed: ${error.message}`
          console.error(message)
        })
    }
  }, [asset])

  return (
    <>
      {loading && <CircularProgress />}
      {asset && (
        <>
          <Grid
            container
            direction="row"
            justifyContent="space-evenly"
            // alignItems="center"
            spacing={5}
            sx={{ px: 5, mt: 1 }}
          >
            <Grid item md={6} xs={12}>
              <Accordion defaultExpanded={true}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  Asset Preview
                </AccordionSummary>
                <AccordionDetails>
                  <img src={asset.assetUrl} alt={`asset-${asset.name}`} width="80%" />
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item md={6} xs={12}>
              <Accordion defaultExpanded={true}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  Details
                </AccordionSummary>
                <AccordionDetails>
                  {nftCollection && (
                    <Typography component="h6" variant="h6" align="left" color="grey">
                      Collected in{' '}
                      <Link
                        to={`/collections/${asset.nftCollectionId}`}
                        style={{ textDecoration: 'none' }}
                      >
                        {nftCollection.name}
                      </Link>
                    </Typography>
                  )}
                  <Typography component="h3" variant="h3" align="left" color="text.primary">
                    {asset.name}
                  </Typography>
                  <Typography
                    component="h5"
                    variant="h5"
                    align="left"
                    color="text.primary"
                    sx={{ fontWeight: 'bold' }}
                  >
                    <Typography component="span" variant="h5" align="left" color="grey">
                      Owned by{' '}
                    </Typography>
                    <Link
                      style={{ textDecoration: 'none' }}
                      to={`/users/${asset.userId}/collections`}
                    >
                      {' '}
                      {user?.username}
                    </Link>
                    <Typography component="span" variant="h5" align="left" color="grey">
                      {' '}
                      Published{' '}
                    </Typography>
                    {moment(asset.publishedAt).format('DD MMM YYYY')}
                    <Typography component="span" align="left" sx={{ ml: 1, verticalAlign: 'top' }}>
                      <Chip
                        key={asset.assetType}
                        sx={{
                          mr: 1,
                          color: '#fff',
                          backgroundColor: collectionTypeLabelColors[asset.assetType],
                        }}
                        label={asset.assetType}
                      />
                    </Typography>
                  </Typography>
                  <br />
                  <Typography component="h5" variant="h5" align="left" color="text.primary">
                    {asset.summary}
                  </Typography>
                  <br />
                  <Typography component="h6" variant="h6" align="left" color="grey">
                    {asset.description}
                  </Typography>
                  <TableContainer component={Paper} sx={{ mt: 2, width: '100%' }}>
                    <Table aria-label="simple table">
                      <TableHead></TableHead>
                      <TableBody>
                        {Object.keys(asset.tokenDetails).map((key) => (
                          <TableRow
                            key={key}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {key}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                              {asset.tokenDetails[key]}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>

          <Accordion defaultExpanded={true} sx={{ mx: 5, mt: 5 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              More Assets from the Same User
            </AccordionSummary>
            <AccordionDetails>
              <AssetsList
                userId={asset.userId}
                excludeAssetId={asset._id}
                enableLoadMore={true}
                enableSearch={false}
                containerStyle={{ py: 2.5, minWidth: '100%' }}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </>
  )
}

export default SingleCollectionPage
