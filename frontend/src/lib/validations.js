import * as Yup from 'yup'
import { statuses, collectionTypes } from './dataConstants'

const collectionValidationSchema = Yup.object().shape({
  name: Yup.string().required('name is required'),
  status: Yup.string().required('status is required').oneOf(statuses),
  summary: Yup.string(),
  description: Yup.string(),
  publishedAt: Yup.date().typeError('invalid date'),
  collectionTypes: Yup.array().of(Yup.string()),
  coverImageUrl: Yup.string().required('you must provide a cover image'),
  bannerImageUrl: Yup.string().required('you must provide a banner image'),
})

const assetValidationSchema = Yup.object().shape({
  name: Yup.string().required('name is required'),
  status: Yup.string().required('status is required').oneOf(statuses),
  summary: Yup.string(),
  description: Yup.string(),
  publishedAt: Yup.date().typeError('invalid date'),
  assetType: Yup.string().required('Asset type is required').oneOf(collectionTypes),
  coverImageUrl: Yup.string().required('you must provide a cover image'),
  assetUrl: Yup.string().required('you must provide an asset url'),
})

const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('must be a valid email').required('email is required'),
  password: Yup.string().required('password is required'),
})

const signUpValidationSchema = Yup.object().shape({
  email: Yup.string().email('must be a valid email').required('email is required'),
  password: Yup.string().required('password is required'),
  username: Yup.string().required('username is required'),
  dob: Yup.string(),
  firstName: Yup.string().required('name is required'),
  lastName: Yup.string(),
  avatarUrl: Yup.string().required('profile picture is required'),
  bannerImage: Yup.string(),
  bio: Yup.string(),
})

export {
  collectionValidationSchema,
  assetValidationSchema,
  loginValidationSchema,
  signUpValidationSchema,
}
