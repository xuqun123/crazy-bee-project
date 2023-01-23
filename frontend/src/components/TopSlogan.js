import * as React from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

function TopSlogan({ header, summary, mainCTAText, secondaryCTA }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth="sm">
        <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
          {header}
        </Typography>
        {summary && (
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            {summary}
          </Typography>
        )}
        <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
          {mainCTAText && (
            <Button data-testid="main-cta-btn" variant="contained">
              {mainCTAText}
            </Button>
          )}
          {secondaryCTA && (
            <Button data-testid="secondary-cta-btn" variant="outlined" href='signup'>
              {secondaryCTA}
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  )
}

export default TopSlogan
