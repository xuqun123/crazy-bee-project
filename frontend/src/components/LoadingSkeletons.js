import * as React from 'react'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Container from '@mui/material/Container'

function LoadingSkeletons({ name, cardsCount }) {
  return (
    <Container>
      <Grid container spacing={4}>
        {Array.from(Array(cardsCount).fill(1)).map((_, index) => (
          <Grid item key={`${name}-${index}`} xs={12} sm={4} md={3}>
            <Skeleton variant="rounded" animation="wave" height={250} sx={{ mt: 5 }} />
            <Skeleton variant="rounded" animation="wave" height={30} sx={{ mt: 3 }} />
            <Skeleton variant="rounded" animation="wave" height={30} sx={{ mt: 3 }} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default LoadingSkeletons
