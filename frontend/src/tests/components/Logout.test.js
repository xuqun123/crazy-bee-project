import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Logout from '../../components/Logout'

describe('Logout', () => {
  beforeEach(() => {
    localStorage.setItem('jwt', 'abcd')
    delete window.location
    window.location = { reload: jest.fn() }
  })

  afterEach(() => jest.clearAllMocks())

  it('logout user with jwt token', async () => {
    render(<Logout />)

    const logoutButton = screen.getByTestId('logout-btn')
    expect(logoutButton).toBeInTheDocument()

    expect(localStorage.getItem('jwt')).not.toBeNull()

    fireEvent.click(logoutButton)
    expect(localStorage.getItem('jwt')).toBeNull()
  })
})
