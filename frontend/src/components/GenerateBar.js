import { useState, useContext, useEffect } from 'react'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArtworkDisplay from '../components/ArtworkDisplay'
import axiosClient from '../lib/axiosClient'
import CurrentUserContext from '../lib/CurrentUserContext'
import AlertMessageContext from '../lib/AlertMessageContext'
import LinearProgress from '@mui/material/LinearProgress'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { generatorStyles } from '../lib/dataConstants'

function GenerateBar() {
  const [inputValue, setInputValue] = useState('')
  const [generatorStyle, setGeneratorStyle] = useState('cute-creature-generator')
  const [disableSubmit, setDisableSubmit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [aiArtData, setAIArtData] = useState({ id: null, output_url: null })
  const [recentNftCollection, setRecentNftCollection] = useState(null)
  const currentUser = useContext(CurrentUserContext)
  const { setAlert } = useContext(AlertMessageContext)

  const disabledInput = () => !(currentUser?._id && recentNftCollection)

  const handleStyleChange = (event) => {
    setGeneratorStyle(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    axiosClient
      .post(`/aiCreator`, { text: inputValue, style: generatorStyle })
      .then((response) => {
        const message = 'Successfully generated a new AI artwork!'
        console.log(message, response?.data)
        setAIArtData(response?.data)
        setDisableSubmit(true)
        setAlert({ message })
        setLoading(false)
      })
      .catch((error) => {
        const errMsg = error.response?.data?.error || error.message
        const message = `Generating AI art failed: ${errMsg}`
        console.error(message)
        setAlert({ message, severity: 'error' })
        setLoading(false)
      })
  }

  useEffect(() => {
    if (currentUser?._id) {
      axiosClient
        .get(`/nftCollections?limit=1&userId=${currentUser?._id}`)
        .then((response) => {
          const { data } = response?.data

          if (data?.length > 0) {
            setRecentNftCollection(data[0])
          }
        })
        .catch((error) => {
          const message = `Cannot retrieve the recent nftCollection record from the current user: ${error.message}`
          console.error(message)
        })
    }
  }, [currentUser?._id])

  return (
    <Container>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
        }}
      >
        <FormControl variant="standard" sx={{ display: 'flex', flexDirection: 'row' }}>
          <Select
            sx={{ pl: 1 }}
            disableUnderline={true}
            labelId="generator-style-select-label"
            id="generator-style-select"
            value={generatorStyle}
            label="Generator Style"
            onChange={handleStyleChange}
            disabled={disabledInput() || disableSubmit}
          >
            {generatorStyles.map((style) => (
              <MenuItem key={style} value={style}>
                {style}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Please enter a text context..."
          inputProps={{ 'aria-label': 'Generate Artwork' }}
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={disabledInput() || disableSubmit}
        />
        <IconButton type="submit" aria-label="generate" disabled={disabledInput() || disableSubmit}>
          <ArrowForwardIcon />
        </IconButton>
      </Paper>
      {loading && <LinearProgress color="info" />}
      {disabledInput() && (
        <Alert severity="error" sx={{ mt: 1 }}>
          Please <strong>login</strong> and ensure to have{' '}
          <strong>at least one NFT collection created</strong> before using this feature!
        </Alert>
      )}

      <ArtworkDisplay
        aiArtData={aiArtData}
        inputData={{ text: inputValue, generatorStyle }}
        recentNftCollectionId={recentNftCollection?._id}
        loading={loading}
      />
    </Container>
  )
}

export default GenerateBar
