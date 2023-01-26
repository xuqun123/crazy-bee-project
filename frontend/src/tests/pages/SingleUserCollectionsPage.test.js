import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import SingleUserCollectionsPage from '../../pages/SingleUserCollectionsPage'
import axiosClient from '../../lib/axiosClient'
import { fakeUser, fakeNftCollection } from '../../lib/testHelper'
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

describe('SingleUserCollectionsPage', () => {
  afterEach(() => jest.clearAllMocks())

  describe('get users data via api', () => {
    beforeEach(() => {
      jest.spyOn(axiosClient, 'get').mockImplementation((url) => {
        if (url.includes('users')) {
          return Promise.resolve({ data: { data: { ...fakeUser } } })
        } else if (url.includes('nftCollections')) {
          return Promise.resolve({ data: { data: [fakeNftCollection], loadMore: true } })
        }
      })
    })

    it('render the SingleUserCollectionsPage view properly with expected elements', async () => {
      const { rerender } = render(<SingleUserCollectionsPage />, { wrapper: MemoryRouter })
      let usernameHeader

      await waitFor(() => {
        usernameHeader = screen.getByText(`@${fakeUser.username}`)
      })
      expect(usernameHeader).toBeInTheDocument()

      const userBioSection = screen.getByText(fakeUser.bio)
      expect(userBioSection).toBeInTheDocument()

      const loadMoreButton = screen.getByTestId('load-more-btn')
      expect(loadMoreButton).toBeInTheDocument()
      rerender(<SingleUserCollectionsPage />, { wrapper: MemoryRouter })

      fireEvent.click(loadMoreButton)
      const userBioSections = await screen.findByText(fakeUser.bio)
      expect(userBioSections).toBeInTheDocument()
    })

    it('snapshot the SingleUserCollectionsPage view with all expected elements', async () => {
      const view = render(<SingleUserCollectionsPage />, { wrapper: MemoryRouter })

      await waitFor(() => {
        expect(screen.getByText(`@${fakeUser.username}`)).toBeInTheDocument()
      })
      expect(view).toMatchSnapshot()
    })
  })

  describe('failed to get the user data', () => {
    const error = new Error('something goes wrong')
    let mockConsoleError

    beforeEach(() => {
      jest.spyOn(axiosClient, 'get').mockRejectedValue(error)
      mockConsoleError = jest.spyOn(console, 'error').mockImplementation((error) => error)
    })

    it('render the SingleUserCollectionsPage view without rendering any user data', async () => {
      render(<SingleUserCollectionsPage />, { wrapper: MemoryRouter })

      await waitFor(() => {
        expect(screen.queryByText(fakeUser.username)).not.toBeInTheDocument()
      })

      expect(mockConsoleError).toHaveBeenCalled()
    })
  })
})
