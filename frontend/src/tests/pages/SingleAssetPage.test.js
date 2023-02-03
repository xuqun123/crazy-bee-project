import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import SingleAssetPage from '../../pages/SingleAssetPage'
import axiosClient from '../../lib/axiosClient'
import { fakeUser, fakeNftCollection, fakeAsset } from '../../lib/testHelper'
import CurrentUserContext from '../../lib/CurrentUserContext'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    const { fakeAsset } = require('../../lib/testHelper')

    return {
      assetId: fakeAsset._id,
    }
  },
}))

describe('SingleAssetPage', () => {
  afterEach(() => jest.clearAllMocks())

  describe('get users data via api', () => {
    beforeEach(() => {
      jest.spyOn(axiosClient, 'get').mockImplementation((url) => {
        if (url.includes(`/users/${fakeUser._id}`)) {
          return Promise.resolve({ data: { data: fakeUser } })
        } else if (url.includes(`nftCollections/${fakeNftCollection._id}`)) {
          return Promise.resolve({ data: { data: fakeNftCollection } })
        } else if (url.includes(`assets/${fakeAsset._id}`)) {
          return Promise.resolve({ data: { data: fakeAsset } })
        } else if (url.includes('assets?limit=')) {
          return Promise.resolve({ data: { data: [fakeAsset] }, loadMore: true })
        }
      })
    })

    it('render the SingleAssetPage view properly with expected elements', async () => {
      render(
        <CurrentUserContext.Provider value={fakeUser}>
          <SingleAssetPage />
        </CurrentUserContext.Provider>,
        { wrapper: MemoryRouter }
      )
      let assetHeader, collectionNameSection

      await waitFor(() => {
        assetHeader = screen.getByText(fakeAsset.name)
      })
      expect(assetHeader).toBeInTheDocument()

      const assetSummary = screen.getByText(fakeAsset.summary)
      expect(assetSummary).toBeInTheDocument()

      await waitFor(() => {
        collectionNameSection = screen.getByText(fakeNftCollection.name)
      })
      expect(collectionNameSection).toBeInTheDocument()

      const usernameSection = screen.getByText(fakeUser.username)
      expect(usernameSection).toBeInTheDocument()
    })

    it('snapshot the SingleAssetPage view with all expected elements', async () => {
      const view = render(
        <CurrentUserContext.Provider value={fakeUser}>
          <SingleAssetPage />
        </CurrentUserContext.Provider>,
        { wrapper: MemoryRouter }
      )

      await waitFor(() => {
        expect(screen.getByText(fakeAsset.name)).toBeInTheDocument()
      })
      expect(view).toMatchSnapshot()
    })
  })

  describe('failed to get the asset data', () => {
    const error = new Error('something goes wrong')
    let mockConsoleError

    beforeEach(() => {
      jest.spyOn(axiosClient, 'get').mockRejectedValue(error)
      mockConsoleError = jest.spyOn(console, 'error').mockImplementation((error) => error)
    })

    it('render the SingleAssetPage view without rendering any nftCollection data', async () => {
      render(
        <CurrentUserContext.Provider value={fakeUser}>
          <SingleAssetPage />
        </CurrentUserContext.Provider>,
        { wrapper: MemoryRouter }
      )

      await waitFor(() => {
        expect(screen.queryByText(fakeAsset.name)).not.toBeInTheDocument()
      })

      expect(mockConsoleError).toHaveBeenCalled()
    })
  })
})
