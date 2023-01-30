import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import TopNav from './components/TopNav'
import CurrentUserContext from './lib/CurrentUserContext'
import AlertMessageContext from './lib/AlertMessageContext'

import './App.css'
import useCurrentUser from './lib/useCurrentUser'
import AlertMessage from './components/AlertMessage'

const theme = createTheme()

function App() {
  const [currentUser] = useCurrentUser()
  const [alert, setAlert] = React.useState({})

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CurrentUserContext.Provider value={currentUser}>
          <AlertMessageContext.Provider value={{ alert, setAlert }}>
            <CssBaseline />
            <TopNav />
            <main>
              <Outlet />
            </main>
            <Footer />
            <AlertMessage />
          </AlertMessageContext.Provider>
        </CurrentUserContext.Provider>
      </ThemeProvider>
    </div>
  )
}

export default App
