import { useState, useEffect, useContext } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { pick } from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup'
import axiosClient from '../lib/axiosClient'
import AlertMessageContext from '../lib/AlertMessageContext'
import CollectionForm from '../components/CollectionForm'
import { collectionValidationSchema } from '../lib/validations'

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

function EditCollectionPage() {
  const { state } = useLocation()
  const { nftCollectionId } = useParams()
  const userId = state?.userId
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [serverError, setsSrverError] = useState(null)
  const [loading, setLoading] = useState(true)
  const { setAlert } = useContext(AlertMessageContext)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(collectionValidationSchema),
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
        setAlert({ message, severity: 'error' })
      })

    axiosClient
      .get(`/nftCollections/${nftCollectionId}`)
      .then((response) => {
        reset(pick(response?.data?.data, Object.keys(defaultValues)))
      })
      .catch((error) => {
        const message = `Get user data failed: ${error.message}`
        console.error(message)
        setAlert({ message, severity: 'error' })
      })
  }, [userId, nftCollectionId, reset, setAlert])

  const handleCancelClick = () => {
    navigate(-1)
  }

  const onSubmit = (data) => {
    setsSrverError(null)

    axiosClient
      .patch(`/nftCollections/${nftCollectionId}`, { nftCollection: data })
      .then((response) => {
        const message = 'NFT collection is updated successfully'
        console.log(message, response.data)
        setAlert({ message })
        navigate(-1)
      })
      .catch((error) => {
        const errMsg = error.response?.data?.error || error.message
        const message = `Update NFT collection failed: ${errMsg}`
        console.error(message)
        setsSrverError(message)
        setAlert({ message, severity: 'error' })
      })
  }

  return (
    <CollectionForm
      formTitle="Edit NFT Collection"
      submitButtonText="Update"
      userId={userId}
      user={user}
      loading={loading}
      control={control}
      formOnSubmit={handleSubmit(onSubmit)}
      handleCancelClick={handleCancelClick}
      serverError={serverError}
      errors={errors}
      register={register}
      InputLabelProps={{ shrink: true }}
    />
  )
}

export default EditCollectionPage
