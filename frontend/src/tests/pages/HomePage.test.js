import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import HomePage from '../../pages/HomePage'
import axiosClient from '../../lib/axiosClient'

describe('HomePage', () => {
  const nftCollection = { name: 'a testing nft collection', _id: '1234-5678-abcd' }

  afterEach(() => jest.clearAllMocks())

  describe('get nftCollections data via api', () => {
    beforeEach(() => {
      jest.spyOn(axiosClient, 'get').mockResolvedValue({ data: { data: [nftCollection] } })
    })

    it('render the HomePage view properly with expected elements', async () => {
      const { rerender } = render(<HomePage />)

      const sloganHeader = screen.getByText(/#1 NFT Marketplace in Australia/)
      const exploreButton = screen.getByTestId('main-cta-btn')
      const signupButton = screen.getByTestId('secondary-cta-btn')

      await waitFor(() => {
        expect(sloganHeader).toBeInTheDocument()
      })
      expect(sloganHeader.tagName.toLowerCase()).toBe('h1')
      expect(exploreButton).toBeInTheDocument()
      expect(exploreButton.tagName.toLowerCase()).toBe('button')
      expect(signupButton).toBeInTheDocument()
      expect(signupButton.tagName.toLowerCase()).toBe('button')

      rerender(<HomePage></HomePage>)

      const nftCollectionNameComponent = screen.getByText(nftCollection.name)
      expect(nftCollectionNameComponent).toBeInTheDocument()
      expect(nftCollectionNameComponent.tagName.toLowerCase()).toBe('h2')
    })

    it('snapshot the HomePage view with all expected elements', async () => {
      const view = render(<HomePage />)

      await waitFor(() => {
        expect(screen.getByText(/#1 NFT Marketplace in Australia/)).toBeInTheDocument()
      })
      expect(view).toMatchSnapshot()
    })
  })

  describe('failed to get nftCollections data', () => {
    const error = new Error('something goes wrong')
    let mockConsoleError

    beforeEach(() => {
      jest.spyOn(axiosClient, 'get').mockRejectedValue(error)
      mockConsoleError = jest.spyOn(console, 'error').mockImplementation((error) => error)
    })

    it('render the HomePage view without listing any nftCollections', async () => {
      const { rerender } = render(<HomePage />)

      const sloganHeader = screen.getByText(/#1 NFT Marketplace in Australia/)
      const exploreButton = screen.getByTestId('main-cta-btn')
      const signupButton = screen.getByTestId('secondary-cta-btn')

      await waitFor(() => {
        expect(sloganHeader).toBeInTheDocument()
      })
      expect(sloganHeader.tagName.toLowerCase()).toBe('h1')
      expect(exploreButton).toBeInTheDocument()
      expect(exploreButton.tagName.toLowerCase()).toBe('button')
      expect(signupButton).toBeInTheDocument()
      expect(signupButton.tagName.toLowerCase()).toBe('button')

      rerender(<HomePage></HomePage>)

      expect(mockConsoleError).toHaveBeenCalled()
    })
  })
})
