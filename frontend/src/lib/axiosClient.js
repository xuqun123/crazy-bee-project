import axios from 'axios'

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('jwt') ? `Bearer ${localStorage.getItem('jwt')}` : '',
  },
})

export default axiosClient
