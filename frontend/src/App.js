import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import TopNav from './components/TopNav'
import SocketContext from './lib/SocketContext'
import CurrentUserContext from './lib/CurrentUserContext'
import AlertMessageContext from './lib/AlertMessageContext'

import './App.css'
import useCurrentUser from './lib/useCurrentUser'
import AlertMessage from './components/AlertMessage'
import SocketConnect from './components/SocketConnect'

const theme = createTheme()

function App() {
  const socket = SocketConnect()
  const [currentUser] = useCurrentUser()
  const [alert, setAlert] = React.useState({})

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CurrentUserContext.Provider value={currentUser}>
          <AlertMessageContext.Provider value={{ alert, setAlert }}>
            <CssBaseline />
            <SocketContext.Provider value={socket}>
              <TopNav />
            </SocketContext.Provider>
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
