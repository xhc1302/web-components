import React from 'react'
import LoadableComponent from '@loadable/component'
import { StateLoading } from '../state-wrapper'

export default Component => props => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </React.Suspense>
  )
}

export const ReactLoadable = component => {
  let Component = LoadableComponent(component)
  return props => {
    return (
      <Component {...props} fallback={
        <div style={{
          height: 'calc(100vh - 56px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <StateLoading {...props} />
        </div>
      } />
    )
  }
}
