import { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Skeleton from '@mui/material/Skeleton'
import { saveAs } from 'file-saver'

const createTabelRow = (name, value) => (
  <TableRow key={name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
    <TableCell component="th" scope="row">
      {name}
    </TableCell>
    <TableCell align="right">{value}</TableCell>
  </TableRow>
)

function ArtworkDisplay({ aiArtData, inputData, recentNftCollectionId, loading }) {
  const [imageData, setImageData] = useState({})

  const downloadArt = () => {
    saveAs(aiArtData.output_url, `${inputData.text}-ai-art.jpg`)
  }

  const loadImageData = () => {
    const img = new Image()
    img.src = aiArtData.output_url

    img.onload = () => {
      setImageData({
        width: img.width,
        height: img.height,
        ratio: img.width / img.height,
      })
    }

    img.onerror = (err) => {
      console.error('loading the newly generated AI art image failed:', err)
    }
  }

  useEffect(() => {
    if (aiArtData.output_url) loadImageData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiArtData.output_url])

  if (loading) {
    return (
      <Paper
        elevation={3}
        sx={{
          py: 4,
          mt: 5,
          justifyContent: 'space-around',
          alignItems: 'center',
          display: 'flex',
          height: 500,
        }}
      >
        <Skeleton variant="rounded" width={500} height={300} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Skeleton variant="rounded" width={400} height={200} />
          <Skeleton animation="wave" width={150} height={50}></Skeleton>
          <Skeleton animation="wave" width={150} height={50}></Skeleton>
        </div>
      </Paper>
    )
  }

  return (
    aiArtData?.output_url?.length > 0 && (
      <Paper
        elevation={3}
        sx={{
          py: 4,
          mt: 5,
          justifyContent: 'space-around',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <img src={aiArtData.output_url} alt={`new AI art ${aiArtData.id}`} width="50%" />
        <div>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table sx={{ width: 400 }} size="small" aria-label="a dense table">
              <TableBody>
                {createTabelRow('Input text', inputData.text)}
                {createTabelRow('Generator style', inputData.generatorStyle)}
                {createTabelRow('unique Art ID', aiArtData.id)}
                {createTabelRow('Dimension', `${imageData.width}x${imageData.height}`)}
              </TableBody>
            </Table>
          </TableContainer>

          <Button sx={{ mb: 2 }} variant="contained" onClick={downloadArt}>
            Download AI Art
          </Button>
          <br />
          <Link
            style={{ textDecoration: 'none' }}
            to={`/collections/${recentNftCollectionId}/assets/new`}
            state={{ output_url: aiArtData.output_url, text: inputData.text }}
          >
            <Button variant="contained" className="primary-action-btn">
              Create New Asset
            </Button>
          </Link>
        </div>
      </Paper>
    )
  )
}

export default ArtworkDisplay
