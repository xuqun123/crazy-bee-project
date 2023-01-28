import * as Yup from 'yup'
import { statuses } from './dataConstants'

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

export { collectionValidationSchema }
