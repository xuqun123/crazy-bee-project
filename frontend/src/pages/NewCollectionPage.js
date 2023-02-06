import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axiosClient from '../lib/axiosClient'
import AlertMessageContext from '../lib/AlertMessageContext'
import CurrentUserContext from '../lib/CurrentUserContext'
import SocketContext from '../lib/SocketContext'
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
  const navigate = useNavigate()
  const [serverError, setsSrverError] = useState(null)
  const { setAlert } = useContext(AlertMessageContext)
  const currentUser = useContext(CurrentUserContext)
  const socket = useContext(SocketContext)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(collectionValidationSchema),
    defaultValues,
  })

  const handleCancelClick = () => {
    navigate(-1)
  }

  const onSubmit = (data) => {
    setsSrverError(null)

    axiosClient
      .post(`/nftCollections`, { nftCollection: { ...data, userId: currentUser?._id } })
      .then((response) => {
        const message = 'NFT collection is created successfully'
        console.log(message, response.data)
        setAlert({ message })
        socket.emit('assetOrCollectionCreated', {
          id: response.data?.data?._id,
          name: response.data?.data?.name,
          type: 'collection',
        })
        navigate(-1)
      })
      .catch((error) => {
        const errMsg = error.response?.data?.error || error.message
        const message = `Create NFT collection failed: ${errMsg}`
        console.error(message)
        setsSrverError(message)
        setAlert({ message, severity: 'error' })
      })
  }

  return (
    <CollectionForm
      formTitle="Create New NFT Collection"
      submitButtonText="Create"
      userId={currentUser?._id}
      user={currentUser}
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
