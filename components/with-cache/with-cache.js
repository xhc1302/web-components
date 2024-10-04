import React from 'react'
import CacheContext from './context'
import Cache from './cache'
import cache from './cache'

export default function withCache (key = window.location.href) {
  return (WrappedComponent) => {
    class withCache extends React.Component {
      constructor(props) {
        super(props)
        this.comRef = React.createRef()
        this.SEARCH_FROM_KEY = `${key}_form`
        let cache = {}
        let { history: { action = 'PUSH' } = {} } = props
        if ('POP' === action.toUpperCase()) {
          cache = Cache.get(key)
          Cache.clear()
        }
        this.state = {
          ...cache,
          cacheFlag: true
        }
      }

      componentWillUnmount () {
        if (this.state.cacheFlag) {
          const formCache = Cache.get(this.SEARCH_FROM_KEY)
          Cache.set(key, { state: this.comRef.current.state, form: formCache })
          Cache.remove(this.SEARCH_FROM_KEY)
        }
      }

      componentDidUpdate () {
        if (this.state.cacheFlag) {
          let comp = this.comRef.current
          let form = comp.form ? comp.form.current : null
          let values = form ? form.getFieldsValue() : {}
          Cache.set(this.SEARCH_FROM_KEY, values)
        }
      }

      saveCacheDate = () => {
        const formCache = Cache.get(this.SEARCH_FROM_KEY)
        Cache.set(key, { state: this.comRef.current.state, form: formCache })
        Cache.remove(this.SEARCH_FROM_KEY)
      }

      setCacheFlag = flag => {
        this.setState({ cacheFlag: flag })
      }

      updateCache = state => {
        let cache = Cache.get(key)
        cache = { ...cache, ...state }
        Cache.set(key, cache)
      }

      removeCache = key => {
        Cache.remove(key)
      }

      clearCache = () => {
        Cache.clear()
        this.setState({form: {}})
      }

      render () {
        let { cacheFlag, ...rest } = this.state
        return (
          <CacheContext.Provider value={{
            ...this.state,
            setCacheFlag: this.setCacheFlag,
            saveCacheDate: this.saveCacheDate,
            updateCache: this.updateCache,
            removeCache: this.removeCache,
            clearCache: this.clearCache,
          }}>
            <WrappedComponent
              {...this.props}
              ref={this.comRef}
              cache={{ ...rest }}
              // setCacheFlag={this.setCacheFlag}
              updateCache={this.updateCache}
              removeCache={this.removeCache}
              clearCache={this.clearCache}
            />
          </CacheContext.Provider>
        )
      }
    }

    const componentName = WrappedComponent.displayName
      || WrappedComponent.name
      || 'Component'

    withCache.displayName = `withCache(${componentName})`
    return withCache
  }
}
