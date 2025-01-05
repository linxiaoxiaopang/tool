/* eslint-disable */
import router from '@/router'

export function getRoutePath(location) {
  const result = router.resolve(location)
  if (!result || result.resolved.path === '/404') return
  
  const href = result.href
  if (href) return /^\//.test(href) ? href : ('/' + href)
}
