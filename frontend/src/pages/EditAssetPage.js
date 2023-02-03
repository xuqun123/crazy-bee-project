import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { pick } from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup'
import axiosClient from '../lib/axiosClient'
import AlertMessageContext from '../lib/AlertMessageContext'
import CurrentUserContext from '../lib/CurrentUserContext'
import { assetValidationSchema } from '../lib/validations'
import AssetForm from '../components/AssetForm'

export const defaultValues = {
  name: '',
  status: '',
  summary: '',
  description: '',
  publishedAt: moment(new Date(), moment.ISO_8601),
  assetType: '',
  coverImageUrl: '',
  assetUrl: '',
}

function EditAssetPage() {
  const { assetId, nftCollectionId } = useParams()
  const navigate = useNavigate()
  const [serverError, setsSrverError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [nftCollection, setNftCollection] = useState(null)
  const { setAlert } = useContext(AlertMessageContext)
  const currentUser = useContext(CurrentUserContext)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(assetValidationSchema),
    defaultValues,
  })

  useEffect(() => {
    axiosClient
      .get(`/nftCollections/${nftCollectionId}`)
      .then((response) => {
        setLoading(false)
        setNftCollection(response?.data?.data)
      })
      .catch((error) => {
        setLoading(false)
        const message = `Get user data failed: ${error.message}`
        console.error(message)
      })
  }, [nftCollectionId])

  useEffect(() => {
    axiosClient
      .get(`/assets/${assetId}`)
      .then((response) => {
        reset(pick(response?.data?.data, Object.keys(defaultValues)))
      })
      .catch((error) => {
        const message = `Get user data failed: ${error.message}`
        console.error(message)
      })
  }, [assetId, reset])

  const handleCancelClick = () => {
    navigate(-1)
  }

  const onSubmit = (data) => {
    setsSrverError(null)

    axiosClient
      .patch(`/assets/${assetId}`, { asset: data })
      .then((response) => {
        const message = 'Asset is updated successfully'
        console.log(message, response.data)
        setAlert({ message })
        navigate(-1)
      })
      .catch((error) => {
        const errMsg = error.response?.data?.error || error.message
        const message = `Update Asset failed: ${errMsg}`
        console.error(message)
        setsSrverError(message)
        setAlert({ message, severity: 'error' })
      })
  }

  return (
    <AssetForm
      formTitle="Edit Asset"
      submitButtonText="Update"
      userId={currentUser?._id}
      user={currentUser}
      loading={loading}
      control={control}
      formOnSubmit={handleSubmit(onSubmit)}
      handleCancelClick={handleCancelClick}
      serverError={serverError}
      errors={errors}
      register={register}
      InputLabelProps={{ shrink: true }}
      nftCollection={nftCollection}
    />
  )
}

export default EditAssetPage
