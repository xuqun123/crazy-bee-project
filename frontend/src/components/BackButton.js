import React from 'react'
import { useLocation } from 'react-router-dom'
import Button from '@mui/material/Button'

const BackButton = () => {
  const location = useLocation()

  const handleClick = () => {
    window.history.back()
  }

  return location.pathname === '/' ? null : (
    <Button variant="h3" color="inherit" fontWeight={'500'} noWrap onClick={handleClick}>
      &laquo; Back
    </Button>
  )
}

export default BackButton
