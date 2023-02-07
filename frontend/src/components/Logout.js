import { useContext } from 'react'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import LogoutIcon from '@mui/icons-material/Logout'
import AlertMessageContext from '../lib/AlertMessageContext'

function Logout() {
  const { setAlert } = useContext(AlertMessageContext)

  const logoutUser = () => {
    setAlert({ message: 'You have been logged out successfully!' })
    localStorage.removeItem('jwt')

    setTimeout(() => window.location.reload(false), 800)
  }

  return (
    <Tooltip title="logout" arrow={true} placement="top">
      <IconButton data-testid="logout-btn" onClick={logoutUser}>
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  )
}

export default Logout
