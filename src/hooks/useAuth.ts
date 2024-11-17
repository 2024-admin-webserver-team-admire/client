import { useState } from 'react'

export default function useAuth() {
  const [isAuthorized, setIsAuthorized] = useState(false)

  return { isAuthorized }
}
