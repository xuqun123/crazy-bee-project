import { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axiosClient from '../lib/axiosClient'
import AlertMessageContext from '../lib/AlertMessageContext'
import CurrentUserContext from '../lib/CurrentUserContext'
import AssetForm from '../components/AssetForm'
import { assetValidationSchema } from '../lib/validations'

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

function NewAssetPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { nftCollectionId } = useParams()
  const { setAlert } = useContext(AlertMessageContext)
  const currentUser = useContext(CurrentUserContext)
  const [nftCollection, setNFTCollection] = useState(null)
  const [loading, setLoading] = useState(true)

  const defaultValuesWithAIArtUrl = () => {
    let result = defaultValues

    if (state?.output_url) result = { ...result, assetUrl: state.output_url, assetType: 'image' }
    if (state?.text) result = { ...result, name: state.text }

    return result
  }

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(assetValidationSchema),
    defaultValues: defaultValuesWithAIArtUrl(),
  })

  useEffect(() => {
    axiosClient
      .get(`/nftCollections/${nftCollectionId}`)
      .then((response) => {
        setLoading(false)
        setNFTCollection(response?.data?.data)
      })
      .catch((error) => {
        setLoading(false)
        const message = `Get nftCollection data failed: ${error.message}`
        console.error(message)
      })
  }, [nftCollectionId])

  const handleCancelClick = () => {
    navigate(-1)
  }

  const onSubmit = (data) => {
    axiosClient
      .post(`/assets`, {
        asset: {
          ...data,
          userId: currentUser?._id,
          nftCollectionId,
        },
        receiverAddress: localStorage.getItem('walletAddress'),
      })
      .then((response) => {
        const message = 'Asset is created successfully'
        console.log(message, response.data)
        setAlert({ message })

        state?.output_url ? navigate(`/assets/${response.data.data._id}`) : navigate(-1)
      })
      .catch((error) => {
        const errMsg = error.response?.data?.error || error.message
        const message = `Create asset failed: ${errMsg}`
        console.error(message)
        setAlert({ message, severity: 'error' })
      })
  }

  return (
    <AssetForm
      formTitle="Create New Asset"
      submitButtonText="Create"
      userId={currentUser?._id}
      user={currentUser}
      loading={loading}
      nftCollection={nftCollection}
      control={control}
      formOnSubmit={handleSubmit(onSubmit)}
      handleCancelClick={handleCancelClick}
      errors={errors}
      register={register}
    />
  )
}

export default NewAssetPage
