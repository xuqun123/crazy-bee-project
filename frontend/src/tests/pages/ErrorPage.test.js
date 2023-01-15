import { render } from '@testing-library/react'
import ErrorPage from '../../pages/ErrorPage'

const errorMessage = 'something goes wrong'
jest.mock('react-router-dom', () => ({
  useRouteError: () => errorMessage,
}))
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

describe('ErrorPage', () => {
  afterEach(() => jest.clearAllMocks())

  it('snapshot the ErrorPage view with all expected elements', () => {
    const view = render(<ErrorPage />)

    expect(mockConsoleError).toHaveBeenCalledWith(errorMessage)
    expect(view).toMatchSnapshot()
  })
})
