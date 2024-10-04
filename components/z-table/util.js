import React from 'react'

//不支持Fragment
export function toArray (children, option) {
  let ret = []

  React.Children.forEach(children, (child) => {
    if (child === undefined || child === null) {
      return
    }

    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child))
    } else {
      ret.push(child)
    }
  })

  return ret
}

export function convertChildrenToColumns (children, options = {}) {

  return toArray(children)
    .filter(node => React.isValidElement(node))
    .map(({ key, props }) => {
      const { children: nodeChildren, ...restProps } = props
      const column = {
        key,
        ...options,
        ...restProps
      }
      if (!!options.render && typeof options.render == 'function') {
        column.render = (txt, record) => options.render(restProps, txt, record)
      }
      if (nodeChildren) {
        column.children = convertChildrenToColumns(nodeChildren)
      }
      return column
    })
}

export function isEmpty (v) {
  if (v === null) return true
  if (typeof v === 'undefined') return true
  if (Object.prototype.toString.call(v) === '[object String]' && !v.length) return true
  return false
}

export function isObject (v) {
  if (v === null) return false
  if (typeof v === 'undefined') return false
  if (Object.prototype.toString.call(v) === '[object Object]') return true
  return false
}
