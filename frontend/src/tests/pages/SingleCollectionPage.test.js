import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import SingleCollectionPage from '../../pages/SingleCollectionPage'
import axiosClient from '../../lib/axiosClient'
import { fakeUser, fakeNftCollection, fakeAsset } from '../../lib/testHelper'
import CurrentUserContext from '../../lib/CurrentUserContext'
import { defaultAssetsLimit } from '../../lib/dataConstants'

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
        if (url.includes(`/assets?limit=${defaultAssetsLimit}&offset=0`)) {
          return Promise.resolve({ data: { data: [fakeAsset], offset: 0, loadMore: true } })
        } else if (
          url.includes(`/assets?limit=${defaultAssetsLimit}&offset=${defaultAssetsLimit}`)
        ) {
          return Promise.resolve({
            data: { data: [{ ...fakeAsset, _id: '123456' }], loadMore: false },
          })
        } else if (url.includes(`nftCollections/${fakeNftCollection._id}`)) {
          return Promise.resolve({ data: { data: fakeNftCollection } })
        }
      })

      jest.spyOn(axiosClient, 'delete').mockImplementation((url) => {
        return Promise.resolve({ data: { data: fakeNftCollection } })
      })
    })

    it('render the SingleCollectionPage view properly with expected elements', async () => {
      const { rerender } = render(
        <CurrentUserContext.Provider value={fakeUser}>
          <SingleCollectionPage />
        </CurrentUserContext.Provider>,
        { wrapper: MemoryRouter }
      )
      let nftCollectionHeader

      await waitFor(() => {
        nftCollectionHeader = screen.getByText(fakeNftCollection.name)
      })
      expect(nftCollectionHeader).toBeInTheDocument()

      const nftCollectionSummary = screen.getByText(fakeNftCollection.summary)
      expect(nftCollectionSummary).toBeInTheDocument()

      const loadMoreButton = screen.getByTestId('load-more-btn')
      expect(loadMoreButton).toBeInTheDocument()
      rerender(
        <CurrentUserContext.Provider value={fakeUser}>
          <SingleCollectionPage />
        </CurrentUserContext.Provider>,
        { wrapper: MemoryRouter }
      )

      fireEvent.click(loadMoreButton)
      const newNftCollectionSummary = await screen.findByText(fakeNftCollection.summary)
      expect(newNftCollectionSummary).toBeInTheDocument()

      const actionButton = screen.getByTestId('nftCollection-action-btn')
      fireEvent.click(actionButton)

      const deleteButton = screen.getByTestId('nftCollection-action-confirm-btn')
      fireEvent.click(deleteButton)

      expect(await screen.findByText(fakeNftCollection.summary)).toBeInTheDocument()
    })

    it('snapshot the SingleCollectionPage view with all expected elements', async () => {
      const view = render(
        <CurrentUserContext.Provider value={fakeUser}>
          <SingleCollectionPage />
        </CurrentUserContext.Provider>,
        { wrapper: MemoryRouter }
      )

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
      render(
        <CurrentUserContext.Provider value={fakeUser}>
          <SingleCollectionPage />
        </CurrentUserContext.Provider>,
        { wrapper: MemoryRouter }
      )

      await waitFor(() => {
        expect(screen.queryByText(fakeUser.username)).not.toBeInTheDocument()
      })

      expect(mockConsoleError).toHaveBeenCalled()
    })
  })
})
