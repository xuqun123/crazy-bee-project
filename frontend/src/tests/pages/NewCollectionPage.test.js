import React from 'react'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import NewCollectionPage, { defaultValues } from '../../pages/NewCollectionPage'
import axiosClient from '../../lib/axiosClient'
import { fakeNftCollection, fakeUser } from '../../lib/testHelper'
import { MemoryRouter } from 'react-router-dom'

defaultValues.publishedAt = new Date(2023, 1, 1)

describe('NewCollectionPage', () => {
  afterEach(() => jest.clearAllMocks())

  describe('get users data via api', () => {
    beforeEach(() => {
      jest.spyOn(axiosClient, 'get').mockImplementation((url) => {
        if (url.includes('/users')) {
          return Promise.resolve({ data: { data: fakeUser } })
        }
      })
      jest
        .spyOn(axiosClient, 'post')
        .mockImplementation(() => Promise.resolve({ data: { data: fakeNftCollection } }))
      jest.spyOn(console, 'log').mockImplementation()
    })

    it('render the NewCollectionPage view with validaiton errors', async () => {
      const { rerender } = render(<NewCollectionPage />, { wrapper: MemoryRouter })
      let usernameHeader

      await waitFor(() => {
        usernameHeader = screen.getByText(`@${fakeUser.username}`)
      })
      expect(usernameHeader).toBeInTheDocument()

      const userBio = screen.getByText(fakeUser.bio)
      expect(userBio).toBeInTheDocument()

      const newFormHeader = screen.getByText('Create New NFT Collection')
      expect(newFormHeader).toBeInTheDocument()

      const submitButton = screen.getByTestId('form-submit-btn')
      // submit the form
      fireEvent.submit(submitButton)

      // get validation errors
      const nameError = await screen.findByText('name is required')
      expect(nameError).toBeInTheDocument()

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      rerender(<NewCollectionPage />, { wrapper: MemoryRouter })
    })

    it('render the NewCollectionPage view and submit the form properly', async () => {
      render(<NewCollectionPage />, { wrapper: MemoryRouter })

      const newFormHeader = screen.getByText('Create New NFT Collection')
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

    it('snapshot the NewCollectionPage view with all expected elements', async () => {
      const view = render(<NewCollectionPage />, { wrapper: MemoryRouter })

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

    it('render the NewCollectionPage view without rendering any nftCollection data', async () => {
      render(<NewCollectionPage />, { wrapper: MemoryRouter })

      await waitFor(() => {
        expect(screen.queryByText(`@${fakeUser.username}`)).not.toBeInTheDocument()
      })

      expect(mockConsoleError).toHaveBeenCalled()
    })
  })
})
