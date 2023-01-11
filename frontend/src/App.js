import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import TopNav from './components/TopNav'

import './App.css'

const theme = createTheme()

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopNav />
        <main>
          <Outlet />
        </main>
        <Footer />
      </ThemeProvider>
    </div>
  )
}

export default App
