import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControl from '@mui/material/FormControl'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import axiosClient from '../lib/axiosClient'
import UserSummary from '../components/UserSummary'
import { collectionTypes as avaliableTypes, statuses } from '../lib/dataConstants'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('name is required'),
  status: Yup.string().required('status is required').oneOf(statuses),
  summary: Yup.string(),
  description: Yup.string(),
  publishedAt: Yup.date().typeError('invalid date'),
  collectionTypes: Yup.array().of(Yup.string()),
  coverImageUrl: Yup.string().required('you must provide a cover image'),
  bannerImageUrl: Yup.string().required('you must provide a banner image'),
})

export const defaultValues = {
  name: '',
  status: '',
  summary: '',
  description: '',
  publishedAt: moment(new Date(), moment.ISO_8601),
  collectionTypes: [],
  coverImageUrl: '',
  bannerImageUrl: '',
}

function NewCollectionPage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [serverError, setsSrverError] = useState(null)
  const [loading, setLoading] = useState(true)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  })

  useEffect(() => {
    axiosClient
      .get(`/users/${userId}`)
      .then((response) => {
        setLoading(false)
        setUser(response?.data?.data)
      })
      .catch((error) => {
        setLoading(false)
        const message = `Get user data failed: ${error.message}`
        console.error(message)
      })
  }, [userId])

  const handleCancelClick = () => {
    navigate(`/users/${userId}/collections`)
  }

  const onSubmit = (data) => {
    setsSrverError(null)

    axiosClient
      .post(`/nftCollections`, { nftCollection: { ...data, userId } })
      .then((response) => {
        console.log('NFT collection is created successfully', response.data)
        navigate(`/users/${userId}/collections`)
      })
      .catch((error) => {
        const errMsg = error.response?.data?.error || error.message
        const message = `Create NFT collection failed: ${errMsg}`
        console.error(message)
        setsSrverError(message)
      })
  }

  return (
    <>
      <UserSummary
        userId={userId}
        user={user}
        loading={loading}
        enableCreate={false}
        enableBannerImage={false}
      />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          '& > :not(style)': {
            mt: 4,
            width: '80%',
          },
        }}
      >
        <Paper elevation={3} sx={{ py: 4 }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <FormControl
              onSubmit={handleSubmit(onSubmit)}
              component="form"
              sx={{
                '& .MuiTextField-root': { my: 2 },
                '& .MuiOutlinedInput-root': { height: 'fit-content' },
                '& .validation-error': { mt: -1, textAlign: 'left' },
                px: 5,
              }}
              fullWidth
              noValidate
              autoComplete="off"
            >
              <Typography
                component="h4"
                variant="h4"
                align="left"
                color="text.primary"
                sx={{ pb: 2 }}
              >
                Create New NFT Collection
              </Typography>

              <Grid container spacing={2}>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    required
                    id="name"
                    label="Name"
                    placeholder="enter your collection name here"
                    {...register('name')}
                    error={errors.name ? true : false}
                  />
                  <Typography className="validation-error" variant="inherit" color="red">
                    {errors.name?.message}
                  </Typography>
                </Grid>
                <Grid item md={2} xs={12}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <InputLabel id="status-label">Status*</InputLabel>
                        <Select
                          {...field}
                          fullWidth
                          labelId="status-label"
                          id="status"
                          label="Status"
                          error={errors.status ? true : false}
                        >
                          {statuses.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  <Typography className="validation-error" variant="inherit" color="red">
                    {errors.status?.message}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    id="summary"
                    label="Summary"
                    multiline
                    rows={4}
                    {...register('summary')}
                    error={errors.summary ? true : false}
                  />
                  <Typography className="validation-error" variant="inherit" color="red">
                    {errors.summary?.message}
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    id="description"
                    label="Description"
                    multiline
                    rows={4}
                    {...register('description')}
                    error={errors.description ? true : false}
                  />
                  <Typography className="validation-error" variant="inherit" color="red">
                    {errors.description?.message}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={4} xs={12}>
                  <Controller
                    name="publishedAt"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        {...field}
                        label="Published At"
                        renderInput={(params) => <TextField fullWidth {...params} />}
                        error={errors.publishedAt ? true : false}
                      />
                    )}
                  />

                  <Typography className="validation-error" variant="inherit" color="red">
                    {errors.publishedAt?.message}
                  </Typography>
                </Grid>

                <Grid item md={6} xs={12}>
                  <Controller
                    name="collectionTypes"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <InputLabel id="collection-types-label">Collection Types</InputLabel>
                        <Select
                          {...field}
                          labelId="collection-types-label"
                          id="collectionTypes"
                          multiple
                          input={<OutlinedInput label="Collection Types" />}
                          MenuProps={MenuProps}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip key={value} label={value} />
                              ))}
                            </Box>
                          )}
                          error={errors.collectionTypes ? true : false}
                        >
                          {avaliableTypes.map((name) => (
                            <MenuItem key={name} value={name}>
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  <Typography className="validation-error" variant="inherit" color="red">
                    {errors.collectionTypes?.message}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    id="coverImageUrl"
                    label="Cover Image URL"
                    {...register('coverImageUrl')}
                    error={errors.coverImageUrl ? true : false}
                  />
                  <Typography className="validation-error" variant="inherit" color="red">
                    {errors.coverImageUrl?.message}
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    id="bannerImageUrl"
                    label="Banner Image URL"
                    {...register('bannerImageUrl')}
                    error={errors.bannerImageUrl ? true : false}
                  />
                  <Typography className="validation-error" variant="inherit" color="red">
                    {errors.bannerImageUrl?.message}
                  </Typography>
                </Grid>
              </Grid>
              <Typography className="validation-error" variant="inherit" color="red" sx={{ pt: 2 }}>
                {serverError}
              </Typography>
              <ButtonGroup
                variant="contained"
                sx={{ boxShadow: 'none', mt: 2, justifyContent: 'flex-end' }}
              >
                <Button color="success" type="submit">
                  Create
                </Button>
                <Button color="inherit" onClick={handleCancelClick}>
                  Cancel
                </Button>
              </ButtonGroup>
            </FormControl>
          </LocalizationProvider>
        </Paper>
      </Box>
    </>
  )
}

export default NewCollectionPage
