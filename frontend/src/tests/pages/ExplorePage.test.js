import { render, screen } from '@testing-library/react'
import ExplorePage from '../../pages/ExplorePage'

describe('ExplorePage', () => {
  it('render the main view properly with TopNav and Footer elements', () => {
    render(<ExplorePage />)

    const sloganHeader = screen.getByText(/Explore NFTs from top creators!/)

    expect(sloganHeader).toBeInTheDocument()
    expect(sloganHeader.tagName.toLowerCase()).toBe('h1')
  })

  it('snapshot the ExplorePage view with all expected elements', () => {
    const view = render(<ExplorePage />)
    expect(view).toMatchSnapshot()
  })
})
