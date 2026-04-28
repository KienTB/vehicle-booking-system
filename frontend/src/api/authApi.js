import { axiosClient } from './axiosClient'

async function login(payload) {
  const response = await axiosClient.post('/auth/login', payload)
  return response.data
}

export const authApi = {
  login,
}
