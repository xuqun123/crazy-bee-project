import { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
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
import { collectionTypeLabelColors, MINTING_STATUSES } from '../lib/dataConstants'
import AssetsList from '../components/AssetsList'
import ActionConfirm from '../components/ActionConfirm'
import axiosClient from '../lib/axiosClient'
import CurrentUserContext from '../lib/CurrentUserContext'
import AlertMessageContext from '../lib/AlertMessageContext'

const renderTokenDetailsInfo = (tokenDetails, key, value) => {
  if (key === 'mintingStatus') {
    return (
      <>
        <Chip
          key={key}
          sx={{
            mr: 1,
            color: '#fff',
            backgroundColor:
              value === MINTING_STATUSES.minted
                ? '#4caf50'
                : value === MINTING_STATUSES.minting
                ? '#f44336'
                : '#2196f3',
            borderRadius: 2,
          }}
          label={value}
        />
        {value === MINTING_STATUSES.minting && ' (please come back and check the status later)'}
      </>
    )
  } else if (
    tokenDetails['mintingStatus'] === MINTING_STATUSES.minting &&
    ['tokenId', 'transactionId', 'pinataUrl'].includes(key)
  ) {
    return <CircularProgress key={key} color="secondary" />
  } else if (key === 'pinataUrl' && value?.includes('http')) {
    return (
      <a key={key} href={value} target="_blank" rel="noreferrer">
        {value}
      </a>
    )
  } else if (key === 'transactionId' && value?.length > 0) {
    return (
      <>
        {value} (
        <a
          key={key}
          href={`https://goerli.etherscan.io/tx/${value}`}
          target="_blank"
          rel="noreferrer"
        >
          etherscan check
        </a>
        )
      </>
    )
  }

  return value
}

function SingleCollectionPage() {
  const { assetId } = useParams()
  const navigate = useNavigate()
  const [asset, setAsset] = useState(null)
  const [nftCollection, setNFTCollection] = useState(null)
  const [assetOwner, setAssetOwner] = useState(null)
  const [loading, setLoading] = useState(true)
  const currentUser = useContext(CurrentUserContext)
  const { setAlert } = useContext(AlertMessageContext)

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
        .get(`/nftCollections/${asset.nftCollectionId}`)
        .then((response) => {
          setNFTCollection(response?.data?.data)
        })
        .catch((error) => {
          const message = `Get asset data failed: ${error.message}`
          console.error(message)
        })

      axiosClient
        .get(`/users/${asset.userId}`)
        .then((response) => {
          setAssetOwner(response?.data?.data)
        })
        .catch((error) => {
          const message = `Get asset data failed: ${error.message}`
          console.error(message)
        })
    }
  }, [asset])

  const handleDelete = (id) => {
    axiosClient
      .delete(`/assets/${id}`)
      .then((response) => {
        const message = 'The Asset has been deleted successfully!'
        console.log(message)
        setAlert({ message })
        navigate(-1)
      })
      .catch((error) => {
        const message = `Delte Asset failed: ${error.message}`
        console.error(message)
        setAlert({ message, severity: 'error' })
      })
  }

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
                  <Typography
                    component="h3"
                    variant="h3"
                    align="left"
                    color="text.primary"
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    {asset.name}
                    {currentUser && currentUser._id === asset.userId && (
                      <Link
                        sx={{ float: 'right' }}
                        to={`/collections/${asset.nftCollectionId}/assets/${asset._id}/edit`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Button
                          sx={{ mr: 1 }}
                          key={asset._id}
                          size="small"
                          variant="contained"
                          color="info"
                        >
                          Edit
                        </Button>
                        <ActionConfirm
                          variant="contained"
                          size="small"
                          color="error"
                          buttonText={'Delete'}
                          entityName="asset"
                          title="Are you sure to delete this Asset?"
                          description="Please be aware there is no turning back and your won't be able to retrieve your NFT from Crazy Bee later! Please cancel this action if this is not what you want."
                          confirmText="Confirm"
                          cancelText="Cancel"
                          confrimAction={() => handleDelete(asset._id)}
                        />
                      </Link>
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
                      Owned by{' '}
                    </Typography>
                    <Link
                      style={{ textDecoration: 'none' }}
                      to={`/users/${asset.userId}/collections`}
                    >
                      {' '}
                      {assetOwner?.username}
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
                  {asset.tokenDetails && (
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
                                {renderTokenDetailsInfo(
                                  asset.tokenDetails,
                                  key,
                                  asset.tokenDetails[key]
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
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
                fullWidth={true}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </>
  )
}

export default SingleCollectionPage
