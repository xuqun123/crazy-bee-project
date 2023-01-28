import { useContext } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import WalletIcon from '@mui/icons-material/Wallet'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import LoginPopup from './LoginPopup'
import CurrentUserContext from '../lib/CurrentUserContext'
import Logout from './Logout'

function TopNav() {
  const currentUser = useContext(CurrentUserContext)

  return (
    <AppBar position="relative">
      <Toolbar sx={{ background: '#faae15' }}>
        <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
          <Grid item sx={{ display: 'flex', alignItems: 'center' }} md={4}>
            <img src="/logo.jpeg" alt="logo" width={50} style={{ marginRight: '10px' }} />
            <Typography variant="h5" color="inherit" fontWeight={'500'} noWrap>
              Crazy Bee
            </Typography>
          </Grid>
          <Grid item md={4}>
            <Link style={{ marginRight: 30 }} to="/">
              Home
            </Link>
            <Link style={{ marginRight: 30 }} to="/explore">
              Explore
            </Link>
            <Link style={{ marginRight: 30 }} to="/ai/creator">
              Create
            </Link>
            <Link style={{ marginRight: 30 }} to="/about">
              About
            </Link>
          </Grid>
          <Grid
            item
            md={4}
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'flex-end',
            }}
          >
            <SearchBar />
            <Tooltip title="connect crypto wallet">
              <IconButton>
                <WalletIcon />
              </IconButton>
            </Tooltip>

            {localStorage.getItem('jwt') ? <Logout /> : <LoginPopup />}
            {currentUser && (
              <Tooltip title={currentUser.username}>
                <Avatar
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                  src={currentUser.avatarUrl}
                />
              </Tooltip>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default TopNav
