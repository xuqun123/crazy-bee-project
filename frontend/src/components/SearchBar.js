import * as React from 'react'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'

function SearchBar() {
  return (
    <Paper
      component="form"
      sx={{
        mr: 2,
        display: 'inline-flex',
        alignItems: 'center',
        width: 200,
        height: 40,
        boxShadow: 'none',
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search for NFTs"
        inputProps={{ 'aria-label': 'search for NFTs' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}

export default SearchBar
