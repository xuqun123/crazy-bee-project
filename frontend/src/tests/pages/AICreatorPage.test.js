import React from 'react'
import { render, screen } from '@testing-library/react'
import AICreatorPage from '../../pages/AICreatorPage'
import { MemoryRouter } from 'react-router-dom'

describe('AICreatorPage', () => {
  afterEach(() => jest.clearAllMocks())

  describe('get users data via api', () => {
    it('render the AICreatorPage view properly with expected elements', async () => {
      render(<AICreatorPage />, { wrapper: MemoryRouter })

      const sloganHeader = screen.getByText('Create Unique Art with our AI Generator')
      expect(sloganHeader).toBeInTheDocument()

      const faqText = screen.getByText('Frequently Asked Questions')
      expect(faqText).toBeInTheDocument()
    })

    it('snapshot the AICreatorPage view with all expected elements', async () => {
      const view = render(<AICreatorPage />, { wrapper: MemoryRouter })
      expect(view).toMatchSnapshot()
    })
  })
})
