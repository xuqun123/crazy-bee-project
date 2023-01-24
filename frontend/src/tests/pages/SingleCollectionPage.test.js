import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import SingleCollectionPage from '../../pages/SingleCollectionPage'
import axiosClient from '../../lib/axiosClient'
import { fakeUser, fakeNftCollection, fakeAsset } from '../../lib/testHelper'
import { MemoryRouter } from 'react-router-dom'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    const { fakeNftCollection } = require('../../lib/testHelper')

    return {
      nftCollectionId: fakeNftCollection._id,
    }
  },
}))

describe('SingleCollectionPage', () => {
  afterEach(() => jest.clearAllMocks())

  describe('get users data via api', () => {
    beforeEach(() => {
      jest.spyOn(axiosClient, 'get').mockImplementation((url) => {
        if (url.includes('/assets')) {
          return Promise.resolve({ data: { data: [fakeAsset], loadMore: true } })
        } else if (url.includes(`nftCollections/${fakeNftCollection._id}`)) {
          return Promise.resolve({ data: { data: fakeNftCollection } })
        }
      })
    })

    it('render the SingleCollectionPage view properly with expected elements', async () => {
      const { rerender } = render(<SingleCollectionPage />, { wrapper: MemoryRouter })
      let nftCollectionHeader

      await waitFor(() => {
        nftCollectionHeader = screen.getByText(fakeNftCollection.name)
      })
      expect(nftCollectionHeader).toBeInTheDocument()

      const nftCollectionSummary = screen.getByText(fakeNftCollection.summary)
      expect(nftCollectionSummary).toBeInTheDocument()

      const loadMoreButton = screen.getByTestId('load-more-btn')
      expect(loadMoreButton).toBeInTheDocument()
      rerender(<SingleCollectionPage />, { wrapper: MemoryRouter })

      fireEvent.click(loadMoreButton)
      const newNftCollectionSummary = await screen.findByText(fakeNftCollection.summary)
      expect(newNftCollectionSummary).toBeInTheDocument()
    })

    it('snapshot the SingleCollectionPage view with all expected elements', async () => {
      const view = render(<SingleCollectionPage />, { wrapper: MemoryRouter })

      await waitFor(() => {
        expect(screen.getByText(fakeNftCollection.name)).toBeInTheDocument()
      })
      expect(view).toMatchSnapshot()
    })
  })

  describe('failed to get the nftCollection data', () => {
    const error = new Error('something goes wrong')
    let mockConsoleError

    beforeEach(() => {
      jest.spyOn(axiosClient, 'get').mockRejectedValue(error)
      mockConsoleError = jest.spyOn(console, 'error').mockImplementation((error) => error)
    })

    it('render the SingleCollectionPage view without rendering any nftCollection data', async () => {
      render(<SingleCollectionPage />, { wrapper: MemoryRouter })

      await waitFor(() => {
        expect(screen.queryByText(fakeUser.username)).not.toBeInTheDocument()
      })

      expect(mockConsoleError).toHaveBeenCalled()
    })
  })
})
