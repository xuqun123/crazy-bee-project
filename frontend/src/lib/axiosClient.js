import axios from 'axios'

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  //   TODO: add AUTH later
})

export default axiosClient
