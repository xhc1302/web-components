export default {
  get: key => {
    try {
      let str = sessionStorage.getItem(key)
      return JSON.parse(str)
    } catch (error) {
      return {}
    }
  },

  set: (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  },

  remove: key => {
    sessionStorage.removeItem(key)
  },

  clear: () => {
    sessionStorage.clear()
  }
}
