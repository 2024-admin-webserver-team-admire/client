import { useCallback, useEffect, useState } from 'react'
import useLocalForage from './useLocalForage'

export default function useAuth() {
  const { get, set } = useLocalForage()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const getUserToken = useCallback(() => get('userToken'), [get])
  const setUserToken = useCallback(
    (token: string) => set('userToken', token),
    [set]
  )
  useEffect(() => {
    getUserToken().then((token) =>
      setIsAuthorized(token != null && token !== '')
    )
  }, [getUserToken])

  return { getUserToken, setUserToken, isAuthorized }
}
