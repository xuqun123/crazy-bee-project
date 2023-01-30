import React from 'react'
import { render, screen } from '@testing-library/react'
import AlertMessage from '../../components/AlertMessage'
import AlertMessageContext from '../../lib/AlertMessageContext'

describe('AlertMessage', () => {
  const alert = { message: 'this is an alert notificaiton message' }
  afterEach(() => jest.clearAllMocks())

  it('logout user with jwt token', async () => {
    render(
      <AlertMessageContext.Provider value={{ alert: alert, setAlert: () => {} }}>
        <AlertMessage />
      </AlertMessageContext.Provider>
    )

    expect(screen.getByText(alert.message)).toBeInTheDocument()
  })
})
