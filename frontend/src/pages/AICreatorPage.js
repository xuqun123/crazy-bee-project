import * as React from 'react'
import GenerateBar from '../components/GenerateBar'
import TopSlogan from '../components/TopSlogan'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

function AICreatorPage() {
  return (
    <>
      <TopSlogan
        header="Create Unique Art with our AI Generator"
        summary="Enter your prompt below and start creating your own art! Our AI model will generate a unique artwork based on your prompt."
        secondarySummary="After an AI art is generated, you can either download it or create a new NFT asset using it."
      />
      <GenerateBar />
      <Container sx={{ pt: 5 }} maxWidth="lg">
        <Typography gutterBottom variant="h5" component="h2">
          Frequently Asked Questions
        </Typography>
        <Typography gutterBottom>
          Can I use this for commercial use? Yes, all commercial use is allowed for the generated
          images.
        </Typography>
        <Typography gutterBottom>
          Who owns the output? The images are considered public domain, that is, they have no owner.
        </Typography>
        <Typography gutterBottom>Can I use the generated images for NFT? Yes.</Typography>
      </Container>
    </>
  )
}

export default AICreatorPage
