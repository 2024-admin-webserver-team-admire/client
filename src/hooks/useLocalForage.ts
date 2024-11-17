import localForage from 'localforage'

const EXPIRE_TIME = 60 * 60 // 1 hour

const useLocalForage = () => {
  const get = async (key: string) => {
    const data = await localForage.getItem(key)

    if (!data) return data

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { expire, value } = data as { expire: number; value: any }

    if (expire < Date.now()) {
      localForage.removeItem(key)
      return null
    }

    return value
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set = async (key: string, value: any, expire = EXPIRE_TIME) => {
    if (expire && typeof expire === 'number')
      expire = Math.round(expire * 1000 + Date.now()) // * 1000 to use seconds

    return localForage.setItem(key, { value, expire })
  }

  return { get, set }
}

export default useLocalForage
