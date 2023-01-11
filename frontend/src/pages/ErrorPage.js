import { useRouteError } from 'react-router-dom'

function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, something went wrong.</p>

      <code>
        <i style={{ fontWeight: 'bold' }}>{error.statusText || error.message}</i>
      </code>
    </div>
  )
}

export default ErrorPage
