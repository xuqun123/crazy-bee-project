import * as React from 'react'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import axiosClient from '../lib/axiosClient'

function GenerateBar() {
  const handleSubmit = (text) => {
    axiosClient
      .post(`api/aiCreator`, { ...text })
      .then((response) => {
        console.log('Generator successful', response.payload)
      })
      .catch((error) => {
        const errMsg = error.response?.payload?.error || error.message
        const message = `Generator failed: ${errMsg}`
        console.error(message)
      })
  }

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mr: 2,
        display: 'inline-flex',
        alignItems: 'center',
        width: 800,
        height: 60,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Input prompt..."
        inputProps={{ 'aria-label': 'Generate Artwork' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="generate">
        <ArrowForwardIcon />
      </IconButton>
    </Paper>
  )
}

export default GenerateBar
