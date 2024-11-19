import { useCallback, useEffect, useState } from 'react'
import { get, set } from '../module/localForage'

export default function useAuth() {
  const [isAuthorized, setIsAuthorized] = useState(true)
  const getUserToken = useCallback(() => get('userToken'), [])
  const setUserToken = useCallback(
    (token: string) => set('userToken', token),
    []
  )

  useEffect(() => {
    getUserToken().then((token) => {
      setIsAuthorized(token != null && token !== '')
    })
  }, [getUserToken])

  return {
    getUserToken,
    setUserToken,
    isAuthorized
  }
}
