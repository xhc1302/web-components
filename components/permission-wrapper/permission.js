export default function PermissionWrapper (props) {
  const { pageId, code, menus = [], children } = props
  if (!pageId || pageId === -1 || !code) return null
  const authorized = findTreeAuthorizedButton(menus, pageId, code)
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
