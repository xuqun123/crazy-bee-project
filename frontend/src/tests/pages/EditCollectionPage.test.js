import React from 'react'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import EditCollectionPage, { defaultValues } from '../../pages/EditCollectionPage'
import axiosClient from '../../lib/axiosClient'
import { fakeUser, fakeNftCollection } from '../../lib/testHelper'
import { MemoryRouter } from 'react-router-dom'

defaultValues.publishedAt = new Date(2023, 1, 1)

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    const { fakeNftCollection } = require('../../lib/testHelper')

    return {
      nftCollectionId: fakeNftCollection._id,
    }
  },
  useLocation: () => {
    const { fakeUser } = require('../../lib/testHelper')

    return {
      state: { userId: fakeUser._id },
    }
  },
}))

describe('EditCollectionPage', () => {
  afterEach(() => jest.clearAllMocks())

  describe('get users and collection data via api', () => {
    beforeEach(() => {
      jest.spyOn(axiosClient, 'get').mockImplementation((url) => {
        if (url.includes('/users')) {
          return Promise.resolve({ data: { data: fakeUser } })
        } else if (url.includes(`/nftCollections/${fakeNftCollection._id}`)) {
          return Promise.resolve({ data: { data: fakeNftCollection } })
        }
      })
      jest
        .spyOn(axiosClient, 'patch')
        .mockImplementation(() => Promise.resolve({ data: { data: fakeNftCollection } }))
      jest.spyOn(console, 'log').mockImplementation()
    })

    it('render the EditCollectionPage view properly with expected elements', async () => {
      const { rerender } = render(<EditCollectionPage />, { wrapper: MemoryRouter })
      let usernameHeader

      await waitFor(() => {
        usernameHeader = screen.getByText(`@${fakeUser.username}`)
      })
      expect(usernameHeader).toBeInTheDocument()

      const userBio = screen.getByText(fakeUser.bio)
      expect(userBio).toBeInTheDocument()

      const editFormHeader = screen.getByText('Edit NFT Collection')
      expect(editFormHeader).toBeInTheDocument()

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      rerender(<EditCollectionPage />, { wrapper: MemoryRouter })
    })

    it('render the EditCollectionPage view and submit the form properly', async () => {
      render(<EditCollectionPage />, { wrapper: MemoryRouter })

      const editFormHeader = screen.getByText('Edit NFT Collection')
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
      const selectNode = statusSelect.childNodes[1]
      fireEvent.input(selectNode, { target: { value: 'draft' } })

      fireEvent.input(screen.getByLabelText('Cover Image URL'), {
        target: {
          value: 'https://new-image-link',
        },
      })
      fireEvent.input(screen.getByLabelText('Banner Image URL'), {
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

    it('snapshot the EditCollectionPage view with all expected elements', async () => {
      const view = render(<EditCollectionPage />, { wrapper: MemoryRouter })

      await waitFor(() => {
        expect(screen.getByText(`@${fakeUser.username}`)).toBeInTheDocument()
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

    it('render the EditCollectionPage view without rendering any nftCollection data', async () => {
      render(<EditCollectionPage />, { wrapper: MemoryRouter })

      await waitFor(() => {
        expect(screen.queryByText(`@${fakeUser.username}`)).not.toBeInTheDocument()
      })

      expect(mockConsoleError).toHaveBeenCalled()
    })
  })
})
