const LOGIN_LIST_KEY = 'LOGIN_LIST_KEY'
const CURRENT_LOGIN_KEY = 'CURRENT_LOGIN_KEY'

// const defaultLogin = {
//   host: '127.0.0.1:9090',
// }
const get = (key) => {
  const item = localStorage.getItem(key)
  if (item) {
    try {
      return JSON.parse(item)
    } catch (e) {
      console.warn('Failed to parse JSON for key:', key, e)
      return item
    }
  }
  return null
}

const set = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val))
}
const storage = {
  get,
  set,
  removeLogin: () => {
    localStorage.removeItem(CURRENT_LOGIN_KEY)
  },
  // clear: () => {
  //   localStorage.clear()
  // },
  // getLoginList: () => {
  //   const loginDataList = localStorage.getItem(LOGIN_LIST_KEY)
  //   return JSON.parse(loginDataList)
  // },
  getLogin: () => {
    return get(CURRENT_LOGIN_KEY)
  },
  setLogin: (val) => {
    set(CURRENT_LOGIN_KEY, val)
  },
}

export default storage
