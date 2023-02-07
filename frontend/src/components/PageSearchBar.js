import * as React from 'react'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

function PageSearchBar({ placeholder, keyword, onSubmit, onChange, onReset }) {
  return (
    <Paper
      component="form"
      sx={{
        p: '4px',
        my: onSubmit ? 0 : 5,
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%',
      }}
      onSubmit={onSubmit}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        onChange={onChange}
        value={keyword}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={onSubmit}>
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={onReset}>
        <RestartAltIcon />
      </IconButton>
    </Paper>
  )
}

export default PageSearchBar
