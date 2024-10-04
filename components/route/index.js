import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { ReactLoadable } from '../loadable'
import AuthRouter from '../auth-router'
import store from 'store'
import { USER_INFO_KEY } from '@config'
let user = store.get(USER_INFO_KEY)

function flatRoute(route) {
  let paths = []
  const treeToArray = (tree, label, url) => {
    let { name = '', path = '', children = [], root = false } = tree
    label += name
    url += path
    if (!root) {
      let l = label.split(',')
      let p = url.split(',')
      paths.push({ ...tree, meta: { names: l, paths: p } })
    }
    if (!tree || !children.length) return
    label += ','
    url += ','
    for (let i = 0, len = children.length; i < len; i++) {
      treeToArray(children[i], label, url)
    }
  }

  treeToArray(route, '', '')
  return paths
}

export default function AppRoute(routes) {

  for (let i = 0, len = routes.length; i < len; i++) {
    let route = routes[i]
    let { authentication = false, routes: rts = [] } = route
    let flatedRoutes = []
    let Router = authentication ? AuthRouter : Route
    for (let rt of rts) {
      let r = flatRoute(rt)
      flatedRoutes = flatedRoutes.concat(r)
    }
    route = { ...route, router: Router, flatedRoutes }
    routes.splice(i, 1, route)
  }

  return (
    routes.map((route, index) => {
      let { layout: Layout, router: Router, flatedRoutes } = route
      let paths = flatedRoutes.map(r => r.path)
      if (!Layout) {
        return flatedRoutes.map((r, i) =>
          <Router
            exact
            key={i}
            meta={r.meta}
            path={r.path}
            component={ReactLoadable(r.component)} />
        )
      }

      return (
        <Route
          key={index}
          path={paths}
          exact
          children={props =>
            <Layout routes={flatedRoutes} {...props}>
              {flatedRoutes.map((r, i) => {
                let { path } = r
                if (path == '/') {
                  return (
                    <Router
                      exact
                      key={i}
                      meta={r.meta}
                      path={r.path}
                    >
                      {path == '/' && user?.roleName != '合作商' && user?.roleName != '投资商' ? ReactLoadable(r.component) : <Redirect to='/smart-quotation/count' />}
                    </Router>
                  )
                }
                return (
                  <Router
                    exact
                    key={i}
                    meta={r.meta}
                    path={r.path}
                    component={ReactLoadable(r.component)} />
                )
              }
              )}
            </Layout>
          }>
        </Route>
      )
    })
  )
}
