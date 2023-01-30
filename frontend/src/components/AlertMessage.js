import * as React from 'react'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import AlertMessageContext from '../lib/AlertMessageContext'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function AlertMessage() {
  const [open, setOpen] = React.useState(false)
  const { alert } = React.useContext(AlertMessageContext)

  React.useEffect(() => {
    if (alert?.message) setOpen(true)
  }, [alert])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={alert?.severity || 'success'} sx={{ width: '100%' }}>
          {alert?.message}
        </Alert>
      </Snackbar>
    </Stack>
  )
}

export default AlertMessage
