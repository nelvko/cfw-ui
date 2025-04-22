const LOGIN_LIST_KEY = 'LOGIN_LIST_KEY'
const CURRENT_LOGIN_KEY = 'CURRENT_LOGIN_KEY'

// const defaultLogin = {
//   host: '127.0.0.1:9090',
// }

const storage = {
  get: (key) => {
    return JSON.parse(localStorage.getItem(key))
  },
  set: (key, val) => {
    localStorage.setItem(key, JSON.stringify(val))
  },
  remove: (key) => {
    localStorage.removeItem(key)
  },
  clear: () => {
    localStorage.clear()
  },
  getLoginList: () => {
    const loginDataList = localStorage.getItem(LOGIN_LIST_KEY)
    return JSON.parse(loginDataList)
  },
  getLogin: () => {
    return this.get(CURRENT_LOGIN_KEY)
  },
  setLogin: (val) => {
    this.set(CURRENT_LOGIN_KEY, val)
  },
}

export default storage
