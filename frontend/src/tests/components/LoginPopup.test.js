import React from 'react'
import { fireEvent, render, screen, act } from '@testing-library/react'
import LoginPopup from '../../components/LoginPopup'
import axiosClient from '../../lib/axiosClient'
import { fakeUser } from '../../lib/testHelper'

describe('LoginPopup', () => {
  beforeEach(() => {
    jest.spyOn(axiosClient, 'post').mockImplementation(() => Promise.resolve({ data: fakeUser }))
    delete window.location
    window.location = { reload: jest.fn() }
    jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => jest.clearAllMocks())

  it('login user with jwt token', async () => {
    render(<LoginPopup />)

    const loginTrigger = screen.getByTestId('login-trigger')
    expect(loginTrigger).toBeInTheDocument()
    expect(localStorage.getItem('jwt')).toBeNull()

    fireEvent.click(loginTrigger)

    const loginButton = screen.getByTestId('login-btn')
    expect(loginButton).toBeInTheDocument()

    // enter valid form details
    fireEvent.input(screen.getByRole('textbox', { name: /email/i }), {
      target: {
        value: 'test@example.com',
      },
    })
    fireEvent.input(screen.getByTestId('password-field'), {
      target: {
        value: 'abcd1234',
      },
    })
    await act(async () => await fireEvent.click(loginButton))

    expect(localStorage.getItem('jwt')).toBeDefined()
  })
})
