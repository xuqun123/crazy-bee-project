import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

function ActionConfirm({
  variant = 'contained',
  size = 'small',
  color = 'error',
  title,
  description,
  buttonText,
  confirmText,
  cancelText,
  confrimAction,
  entityName,
}) {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleClose = (event) => {
    event.preventDefault()
    setOpen(false)
  }

  const handleConfirm = (event) => {
    event.preventDefault()
    if (confrimAction) confrimAction()
    setOpen(false)
  }

  return (
    <>
      <Button
        data-testid={`${entityName}-action-btn`}
        variant={variant}
        color={color}
        size={size}
        onClick={handleClickOpen}
      >
        {buttonText}
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            {cancelText}
          </Button>
          <Button
            data-testid={`${entityName}-action-confirm-btn`}
            variant="contained"
            color="error"
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ActionConfirm
