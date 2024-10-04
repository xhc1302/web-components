import React from 'react'

const warningFunc = () => {
  console.warn('Can not find CacheContext. Please make sure you wrap component under @withCache.')
}

export default React.createContext({
  setCacheFlag: warningFunc,
  updateCache: warningFunc,
  removeCache: warningFunc,
  clearCache: warningFunc
})
