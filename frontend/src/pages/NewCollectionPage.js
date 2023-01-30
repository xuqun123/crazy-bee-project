import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axiosClient from '../lib/axiosClient'
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
      })
  }, [userId])

  const handleCancelClick = () => {
    navigate(-1)
  }

  const onSubmit = (data) => {
    setsSrverError(null)

    axiosClient
      .post(`/nftCollections`, { nftCollection: { ...data, userId } })
      .then((response) => {
        console.log('NFT collection is created successfully', response.data)
        navigate(-1)
      })
      .catch((error) => {
        const errMsg = error.response?.data?.error || error.message
        const message = `Create NFT collection failed: ${errMsg}`
        console.error(message)
        setsSrverError(message)
      })
  }

  return (
    <CollectionForm
      formTitle="Create New NFT Collection"
      submitButtonText="Create"
      userId={userId}
      user={user}
      loading={loading}
      control={control}
      formOnSubmit={handleSubmit(onSubmit)}
      handleCancelClick={handleCancelClick}
      serverError={serverError}
      errors={errors}
      register={register}
    />
  )
}

export default NewCollectionPage