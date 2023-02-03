import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import EditAssetPage, { defaultValues } from '../../pages/EditAssetPage'
import axiosClient from '../../lib/axiosClient'
import { fakeUser, fakeNftCollection, fakeAsset } from '../../lib/testHelper'
import CurrentUserContext from '../../lib/CurrentUserContext'

defaultValues.publishedAt = new Date(2023, 1, 1)

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    const { fakeNftCollection, fakeAsset } = require('../../lib/testHelper')

    return {
      nftCollectionId: fakeNftCollection._id,
      assetId: fakeAsset._id,
    }
  },
  useLocation: () => {
    const { fakeUser } = require('../../lib/testHelper')

    return {
      state: { userId: fakeUser._id },
    }
  },
}))

describe('EditAssetPage', () => {
  afterEach(() => jest.clearAllMocks())

  describe('get users and collection data via api', () => {
    beforeEach(() => {
      jest.spyOn(axiosClient, 'get').mockImplementation((url) => {
        if (url.includes('/users')) {
          return Promise.resolve({ data: { data: fakeUser } })
        } else if (url.includes(`/nftCollections/${fakeNftCollection._id}`)) {
          return Promise.resolve({ data: { data: fakeNftCollection } })
        } else if (url.includes(`/assets/${fakeAsset._id}`)) {
          return Promise.resolve({ data: { data: fakeAsset } })
        }
      })
      jest
        .spyOn(axiosClient, 'patch')
        .mockImplementation(() => Promise.resolve({ data: { data: fakeAsset } }))
      jest.spyOn(console, 'log').mockImplementation()
    })

    it('render the EditAssetPage view properly with expected elements', async () => {
      render(
        <CurrentUserContext.Provider value={fakeUser}>
          <EditAssetPage />
        </CurrentUserContext.Provider>,
        { wrapper: MemoryRouter }
      )
      let nftCollectionHeader
      await waitFor(() => {
        nftCollectionHeader = screen.getByText(fakeNftCollection.name)
      })
      expect(nftCollectionHeader).toBeInTheDocument()

      const editFormHeader = screen.getByText('Edit Asset')
      expect(editFormHeader).toBeInTheDocument()

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
    })

    it('render the EditAssetPage view and submit the form properly', async () => {
      render(
        <CurrentUserContext.Provider value={fakeUser}>
          <EditAssetPage />
        </CurrentUserContext.Provider>,
        { wrapper: MemoryRouter }
      )

      const editFormHeader = screen.getByText('Edit Asset')
      expect(editFormHeader).toBeInTheDocument()

      // enter valid form details
      fireEvent.input(screen.getByRole('textbox', { name: /name/i }), {
        target: {
          value: 'new name',
        },
      })
      fireEvent.input(screen.getByRole('textbox', { name: /summary/i }), {
        target: {
          value: 'new summary',
        },
      })

      const statusSelect = screen.getByTestId('status-select-field')
      const statusSelectNode = statusSelect.childNodes[1]
      fireEvent.input(statusSelectNode, { target: { value: 'draft' } })

      const assetTypeSelect = screen.getByTestId('asset-type-select-field')
      const assetSelectNode = assetTypeSelect.childNodes[1]
      fireEvent.input(assetSelectNode, { target: { value: 'image' } })

      fireEvent.input(screen.getByLabelText('Cover Image URL'), {
        target: {
          value: 'https://new-image-link',
        },
      })
      fireEvent.input(screen.getByLabelText('Asset URL'), {
        target: {
          value: 'https://new-image-link',
        },
      })

      // submit the form
      const submitButton = screen.getByTestId('form-submit-btn')
      // submit the form
      await act(async () => await fireEvent.submit(submitButton))

      await waitFor(() => {
        expect(screen.queryByText('name is required')).not.toBeInTheDocument()
      })
    })

    it('snapshot the EditAssetPage view with all expected elements', async () => {
      const view = render(
        <CurrentUserContext.Provider value={fakeUser}>
          <EditAssetPage />
        </CurrentUserContext.Provider>,
        { wrapper: MemoryRouter }
      )

      await waitFor(() => {
        expect(screen.getByText(fakeNftCollection.name)).toBeInTheDocument()
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

    it('render the EditAssetPage view without rendering any asset data', async () => {
      render(
        <CurrentUserContext.Provider value={fakeUser}>
          <EditAssetPage />
        </CurrentUserContext.Provider>,
        { wrapper: MemoryRouter }
      )

      await waitFor(() => {
        expect(screen.queryByRole('textbox', { name: /name/i }).value).toBe('')
      })

      expect(mockConsoleError).toHaveBeenCalled()
    })
  })
})
