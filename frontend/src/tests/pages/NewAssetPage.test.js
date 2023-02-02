import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import NewAssetPage, { defaultValues } from '../../pages/NewAssetPage'
import axiosClient from '../../lib/axiosClient'
import CurrentUserContext from '../../lib/CurrentUserContext'
import { fakeAsset, fakeNftCollection, fakeUser } from '../../lib/testHelper'

defaultValues.publishedAt = new Date(2023, 1, 1)

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    const { fakeNftCollection } = require('../../lib/testHelper')

    return {
      nftCollectionId: fakeNftCollection._id,
    }
  },
}))

describe('NewAssetPage', () => {
  afterEach(() => jest.clearAllMocks())

  describe('get users data via api', () => {
    beforeEach(() => {
      jest.spyOn(axiosClient, 'get').mockImplementation((url) => {
        if (url.includes(`/nftCollections/${fakeNftCollection._id}`)) {
          return Promise.resolve({ data: { data: fakeNftCollection } })
        }
      })
      jest
        .spyOn(axiosClient, 'post')
        .mockImplementation(() => Promise.resolve({ data: { data: fakeAsset } }))
      jest.spyOn(console, 'log').mockImplementation()
    })

    it('render the NewAssetPage view with validaiton errors', async () => {
      render(
        <CurrentUserContext.Provider value={fakeUser}>
          <NewAssetPage />
        </CurrentUserContext.Provider>,
        { wrapper: MemoryRouter }
      )

      let nftCollectionHeader
      await waitFor(() => {
        nftCollectionHeader = screen.getByText(fakeNftCollection.name)
      })
      expect(nftCollectionHeader).toBeInTheDocument()

      const newFormHeader = screen.getByText('Create New Asset')
      expect(newFormHeader).toBeInTheDocument()

      const submitButton = screen.getByTestId('form-submit-btn')
      // submit the form
      fireEvent.submit(submitButton)

      // get validation errors
      const nameError = await screen.findByText('name is required')
      expect(nameError).toBeInTheDocument()

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
    })

    it('render the NewAssetPage view and submit the form properly', async () => {
      render(
        <CurrentUserContext.Provider value={fakeUser}>
          <NewAssetPage />
        </CurrentUserContext.Provider>,
        { wrapper: MemoryRouter }
      )

      const newFormHeader = screen.getByText('Create New Asset')
      expect(newFormHeader).toBeInTheDocument()

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

      const assetSelect = screen.getByTestId('asset-type-select-field')
      const assetSelectNode = assetSelect.childNodes[1]
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

    it('snapshot the NewAssetPage view with all expected elements', async () => {
      const view = render(
        <CurrentUserContext.Provider value={fakeUser}>
          <NewAssetPage />
        </CurrentUserContext.Provider>,
        { wrapper: MemoryRouter }
      )

      await waitFor(() => {
        expect(screen.getByText(fakeNftCollection.name)).toBeInTheDocument()
      })

      expect(view).toMatchSnapshot()
    })
  })
})
