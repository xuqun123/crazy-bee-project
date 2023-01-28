import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import TopNav from './components/TopNav'
import CurrentUserContext from './lib/CurrentUserContext'

import './App.css'
import useCurrentUser from './lib/useCurrentUser'

const theme = createTheme()

function App() {
  const [currentUser] = useCurrentUser()

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CurrentUserContext.Provider value={currentUser}>
          <CssBaseline />
          <TopNav />
          <main>
            <Outlet />
          </main>
          <Footer />
        </CurrentUserContext.Provider>
      </ThemeProvider>
    </div>
  )
}

export default App
