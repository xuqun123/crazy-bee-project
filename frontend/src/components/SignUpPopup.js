import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ButtonGroup from '@mui/material/ButtonGroup'
import FormControl from '@mui/material/FormControl'
import Link from '@mui/material/Link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axiosClient from '../lib/axiosClient'
import { signUpValidationSchema } from '../lib/validations'

function SignUpPopup({ buttonStyle, buttonText }) {
  const [open, setOpen] = useState(false)
  const [serverError, setsServerError] = useState(null)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data) => {
    setsServerError(null)

    axiosClient
      .post(`/auth/signup`, { ...data })
      .then((response) => {
        console.log('The user has signed up successfully', response.data)
        setOpen(false)
        window.location.reload(false)
      })
      .catch((error) => {
        const errMsg = error.response?.data?.error || error.message
        const message = `Sign up failed: ${errMsg}`
        console.error(message)
        setsServerError(errMsg)
      })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpValidationSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
      dob: '',
      firstName: '',
      lastName: '',
      avatarUrl: '',
      bannerImageUrl: '',
      bio: '',
    },
  })

  return (
    <div>
      <Tooltip title="sign up">
        <Button
          variant="text"
          onClick={handleClickOpen}
          {...buttonStyle}
          data-testid="signup-trigger"
        >
          {buttonText || 'Signup'}
        </Button>
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
            <Typography component="p" variant="h7" color="text.primary" fontWeight="bold" mt={1}>
              Personal Details
            </Typography>
            <TextField
              margin="dense"
              id="firstName"
              label="Firstname"
              type="text"
              fullWidth
              variant="filled"
              placeholder="Please enter your first name"
              {...register('firstName')}
              error={errors.firstName ? true : false}
            />
            <Typography className="validation-error" variant="inherit" color="red">
              {errors.firstName?.message}
            </Typography>
            <TextField
              margin="dense"
              id="lastName"
              label="Lastname"
              type="text"
              fullWidth
              variant="filled"
              placeholder="Please enter your last name"
              {...register('lastName')}
              error={errors.lastName ? true : false}
            />
            <Typography className="validation-error" variant="inherit" color="red">
              {errors.lastName?.message}
            </Typography>
            <Typography component="p" variant="h7" color="text.primary" fontWeight="bold" mt={1}>
              Login Details
            </Typography>
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
            <Typography component="p" variant="h7" color="text.primary" fontWeight="bold" mt={1}>
              Account Details
            </Typography>
            <TextField
              margin="dense"
              id="username"
              label="Username"
              type="text"
              fullWidth
              variant="filled"
              placeholder="Please enter a username"
              {...register('username')}
              error={errors.username ? true : false}
            />
            <Typography className="validation-error" variant="inherit" color="red">
              {errors.username?.message}
            </Typography>
            <TextField
              margin="dense"
              id="bio"
              label="Bio"
              type="text"
              fullWidth
              variant="filled"
              placeholder="Please write a short description"
              {...register('bio')}
              error={errors.bio ? true : false}
            />
            <Typography className="validation-error" variant="inherit" color="red">
              {errors.bio?.message}
            </Typography>
            <TextField
              margin="dense"
              id="avatarUrl"
              label="Profile Picture URL"
              type="text"
              fullWidth
              variant="filled"
              placeholder="Paste image URL for your Avatar"
              {...register('avatarUrl')}
              error={errors.avatarUrl ? true : false}
            />
            <Typography className="validation-error" variant="inherit" color="red">
              {errors.avatarUrl?.message}
            </Typography>
          </FormControl>
          <Link href="#" underline="hover" className="primary-action-link">
            Please read our terms of use before signing up to use our service!
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
          <Typography
            className="validation-error"
            variant="inherit"
            color="red"
            sx={{ fontSize: 12 }}
          >
            {serverError}
          </Typography>
          <ButtonGroup>
            <Button variant="text" onClick={handleClose} data-testid="close-trigger">
              Login
            </Button>
            <Button
              variant="contained"
              className="primary-action-btn"
              data-testid="Signup-btn"
              onClick={handleSubmit(onSubmit)}
            >
              'Sign up'
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default SignUpPopup
