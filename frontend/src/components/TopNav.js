import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import LoginIcon from '@mui/icons-material/Login'
import WalletIcon from '@mui/icons-material/Wallet'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'

function TopNav() {
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
            <IconButton>
              <WalletIcon />
            </IconButton>
            <IconButton href="login">
              <LoginIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default TopNav
