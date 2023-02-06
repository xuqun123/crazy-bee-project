import React from 'react'
import { useLocation } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const BackButton = () => {
  const location = useLocation()

  const handleClick = () => {
    window.history.back()
  }

  return location.pathname === '/' ||
    location.pathname === '/explore' ||
    location.pathname === '/ai/creator' ? null : (
    <IconButton
      variant="h5"
      color="inherit"
      fontWeight={'500'}
      sx={{ ml: 1 }}
      onClick={handleClick}
    >
      <ArrowBackIcon />
    </IconButton>
  )
}

export default BackButton
