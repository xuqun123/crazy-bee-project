import * as React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import FormControl from '@mui/material/FormControl'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { Controller } from 'react-hook-form'
import { collectionTypes as avaliableTypes, statuses } from '../lib/dataConstants'
import CollectionSummary from './CollectionSummary'

function AssetForm({
  formTitle,
  submitButtonText,
  user,
  loading,
  control,
  formOnSubmit,
  handleCancelClick,
  errors,
  register,
  InputLabelProps = null,
  nftCollection,
}) {
  return (
    <>
      <CollectionSummary
        user={user}
        nftCollection={nftCollection}
        loading={loading}
        enableBannerImage={false}
        enableEdit={false}
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
              onSubmit={formOnSubmit}
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
                {formTitle}
              </Typography>

              {formTitle.includes('New') &&
                (localStorage.getItem('walletAddress') ? (
                  <Alert severity="info">
                    Since you have connected to a crypto wallet, please be aware{' '}
                    <strong>
                      when you create this asset, it will be automatically minted as a new NFT token
                      and sent to your wallet!
                    </strong>
                  </Alert>
                ) : (
                  <Alert severity="warning">
                    {' '}
                    Since you haven't connected to any crypto wallet yet,{' '}
                    <strong>
                      when you create this asset, it will not be minted as a new NFT token!
                    </strong>
                  </Alert>
                ))}

              {formTitle.includes('Edit') && (
                <Alert severity="info">
                  Once this asset is created, you can't edit the <strong>assetUrl</strong> field
                  anymore as a NFT token is non-fungible after it's minted to the blockain.
                </Alert>
              )}

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
                    InputLabelProps={InputLabelProps}
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
                        <InputLabel id="status">Status*</InputLabel>
                        <Select
                          {...field}
                          fullWidth
                          labelId="status-label"
                          id="status"
                          label="Status"
                          data-testid="status-select-field"
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
                    InputLabelProps={InputLabelProps}
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
                    InputLabelProps={InputLabelProps}
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

                <Grid item md={2} xs={12}>
                  <Controller
                    name="assetType"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <InputLabel id="assetType">Asset Type*</InputLabel>
                        <Select
                          {...field}
                          fullWidth
                          labelId="asset-type-label"
                          id="assetType"
                          label="Asset Type"
                          data-testid="asset-type-select-field"
                          error={errors.assetType ? true : false}
                        >
                          {avaliableTypes.map((assetType) => (
                            <MenuItem key={assetType} value={assetType}>
                              {assetType}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  <Typography className="validation-error" variant="inherit" color="red">
                    {errors.assetType?.message}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                  <TextField
                    data-testid="cover-image-input"
                    fullWidth
                    id="coverImageUrl"
                    label="Cover Image URL"
                    {...register('coverImageUrl')}
                    error={errors.coverImageUrl ? true : false}
                    InputLabelProps={InputLabelProps}
                  />
                  <Typography className="validation-error" variant="inherit" color="red">
                    {errors.coverImageUrl?.message}
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    id="assetUrl"
                    label="Asset URL"
                    {...register('assetUrl')}
                    error={errors.assetUrl ? true : false}
                    InputLabelProps={InputLabelProps}
                    disabled={formTitle.includes('Edit')}
                  />
                  <Typography className="validation-error" variant="inherit" color="red">
                    {errors.assetUrl?.message}
                  </Typography>
                </Grid>
              </Grid>
              <ButtonGroup
                variant="contained"
                sx={{ boxShadow: 'none', mt: 2, justifyContent: 'flex-end' }}
              >
                <Button data-testid="form-submit-btn" color="success" type="submit">
                  {submitButtonText}
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

export default AssetForm
