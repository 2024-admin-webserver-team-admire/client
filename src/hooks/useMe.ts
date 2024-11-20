import axios from 'axios'
import { useCallback, useState, useEffect } from 'react'
import useAuth from './useAuth'
import { errorToast } from '../module/toast'
import { Writer } from 'types'

const API_URL = import.meta.env.VITE_API_URL

const useMe = () => {
  const { getUserToken } = useAuth()
  const [userData, setUserData] = useState<Writer | null>(null)

  const fetchUserData = useCallback(async () => {
    const token = await getUserToken()
    try {
      const response = await axios.post(
        `${API_URL}/members/me`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setUserData(response.data)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      errorToast('사용자 정보 가져오기 실패')
    }
  }, [getUserToken])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  return { userData }
}

export default useMe
