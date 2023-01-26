import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import NewCollectionPage from '../../pages/NewCollectionPage'
import axiosClient from '../../lib/axiosClient'
import { fakeUser, fakeAsset } from '../../lib/testHelper'
import { MemoryRouter } from 'react-router-dom'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    const { fakeUser } = require('../../lib/testHelper')

    return {
      userId: fakeUser._id,
    }
  },
}))

describe('NewCollectionPage', () => {
  afterEach(() => jest.clearAllMocks())

  describe('get users data via api', () => {
    beforeEach(() => {
      jest.spyOn(axiosClient, 'get').mockImplementation((url) => {
        if (url.includes('/users')) {
          return Promise.resolve({ data: { data: fakeUser } })
        }
      })
    })

    it('render the NewCollectionPage view properly with expected elements', async () => {
      const { rerender } = render(<NewCollectionPage />, { wrapper: MemoryRouter })
      let usernameHeader

      await waitFor(() => {
        usernameHeader = screen.getByText(`@${fakeUser.username}`)
      })
      expect(usernameHeader).toBeInTheDocument()

      const userBio = screen.getByText(fakeUser.bio)
      expect(userBio).toBeInTheDocument()

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      rerender(<NewCollectionPage />, { wrapper: MemoryRouter })
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
