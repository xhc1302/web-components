import { store } from '@utils/xstate'
import { GLOBAL_ACTION_NAME } from '@config'

export default function PermissionWrapper (props) {
  let { pageId, code, children } = props
  if (!pageId || pageId === -1 || !code) return null
  let states = store.getState()
  let { menus = [] } = states[GLOBAL_ACTION_NAME] || {}
  let authorized = findTreeAuthorizedButton(menus, pageId, code)
  if (!authorized) return null
  return children
}

function findTreeAuthorizedButton (tree, pageId, code) {
  for (const node of tree) {
    if (pageId == node.id && node.authorizedButtons) {
      for (const btn of node.authorizedButtons) {
        if (btn.code === code) return true
      }
    }
    if (node.children) {
      const res = findTreeAuthorizedButton(node.children, pageId, code)
      if (res) return res
    }
  }
  return false
}
