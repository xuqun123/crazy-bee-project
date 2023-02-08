import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

describe('App', () => {
  it('render the main view properly with TopNav and Footer elements', () => {
    render(<App />, { wrapper: BrowserRouter })

    const homeLink = screen.getByText(/Home/)
    const exploreLink = screen.getByText(/Explore/)
    const createAIArtLink = screen.getByText(/Create AI Art/)
    const footerNote = screen.getByText(/We fly tokens to your pockets/i)

    expect(homeLink).toBeInTheDocument()
    expect(homeLink.tagName.toLowerCase()).toBe('a')
    expect(exploreLink).toBeInTheDocument()
    expect(exploreLink.tagName.toLowerCase()).toBe('a')
    expect(createAIArtLink).toBeInTheDocument()
    expect(createAIArtLink.tagName.toLowerCase()).toBe('a')
    expect(footerNote).toBeInTheDocument()
    expect(footerNote.tagName.toLowerCase()).toBe('p')
  })

  it('snapshot the main app view with all expected elements', () => {
    const view = render(<App />, { wrapper: BrowserRouter })
    expect(view).toMatchSnapshot()
  })
})
