import * as React from 'react'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import LogoutIcon from '@mui/icons-material/Logout'

function Logout() {
  const logoutUser = () => {
    localStorage.removeItem('jwt')
    window.location.reload(false)
  }

  return (
    <Tooltip title="logout">
      <IconButton onClick={logoutUser}>
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  )
}

export default Logout
