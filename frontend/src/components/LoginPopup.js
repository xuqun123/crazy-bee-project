import { useState, useContext } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Tooltip from '@mui/material/Tooltip'
import LoginIcon from '@mui/icons-material/Login'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ButtonGroup from '@mui/material/ButtonGroup'
import FormControl from '@mui/material/FormControl'
import Link from '@mui/material/Link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axiosClient from '../lib/axiosClient'
import AlertMessageContext from '../lib/AlertMessageContext'
import { loginValidationSchema } from '../lib/validations'
import SignUpPopup from './SignUpPopup'

function LoginPopup() {
  const [open, setOpen] = useState(false)
  const { setAlert } = useContext(AlertMessageContext)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data) => {
    axiosClient
      .post(`/auth/login`, { ...data })
      .then((response) => {
        const message = `Welcome back, ${response.data?.user?.username}!`
        console.log('The user has been logged in successfully', response.data)
        setOpen(false)
        setAlert({ message })

        setTimeout(() => {
          localStorage.setItem('jwt', response.data.token)
          window.location.reload(false)
        }, 800)
      })
      .catch((error) => {
        const errMsg = error.response?.data?.error || error.message
        const message = `Failed to login: ${errMsg}`
        console.error(message)
        setAlert({ message, severity: 'error' })
      })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <div>
      <Tooltip title="login" arrow={true} placement="top">
        <IconButton onClick={handleClickOpen} data-testid="login-trigger">
          <LoginIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <img src="/logo.jpeg" alt="logo" width={70} style={{ marginRight: '10px' }} />
          <Typography component="p" variant="h5" color="text.primary" fontWeight="bold" mt={1}>
            Crazy Bee
          </Typography>
        </DialogTitle>
        <DialogContent>
          <FormControl
            onSubmit={handleSubmit(onSubmit)}
            component="form"
            fullWidth
            noValidate
            autoComplete="off"
          >
            <TextField
              margin="dense"
              id="email"
              label="Email"
              type="email"
              fullWidth
              variant="filled"
              placeholder="Please enter your email"
              {...register('email')}
              error={errors.email ? true : false}
            />
            <Typography className="validation-error" variant="inherit" color="red">
              {errors.email?.message}
            </Typography>
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="filled"
              placeholder="Please enter your password"
              {...register('password')}
              error={errors.password ? true : false}
              inputProps={{ 'data-testid': 'password-field' }}
            />
            <Typography className="validation-error" variant="inherit" color="red">
              {errors.password?.message}
            </Typography>
          </FormControl>

          {/* TODO: link to reset password popup here */}
          <Link href="#" underline="hover" className="primary-action-link">
            Forget your password?
          </Link>
        </DialogContent>
        <DialogActions
          sx={{
            mx: 2,
            mb: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div />
          <ButtonGroup>
            <SignUpPopup />
            <Button
              variant="contained"
              className="primary-action-btn"
              data-testid="login-btn"
              onClick={handleSubmit(onSubmit)}
            >
              Login
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default LoginPopup
