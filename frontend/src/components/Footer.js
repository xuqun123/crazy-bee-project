import * as React from 'react'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import EmojiNatureIcon from '@mui/icons-material/EmojiNature'

function Footer() {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 4 }} component="footer">
      <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
        <EmojiNatureIcon sx={{ verticalAlign: 'top', color: '#faae15' }} />
        We fly tokens to your pockets!
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://github.com/xuqun123/crazy-bee-project">
          Crazy Bee
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Box>
  )
}

export default Footer
