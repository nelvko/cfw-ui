const storage = {
  get: (key) => localStorage.getItem(key),
  set: (key, value) => localStorage.setItem(key, value),
  getLogin: () => localStorage.getItem('login') ?? { baseurl: 'localhost:9090' },
}

export default storage
