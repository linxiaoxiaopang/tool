/* eslint-disable */
import { find, map, flatten } from 'lodash'
import { validatenull } from '@/components/avue/utils/validate'

export function findDeep(collection, predicate, { fromIndex, children = 'children' } = {}) {
  if (validatenull(collection)) return
  const item = find(collection, predicate, fromIndex)
  if (item) return item
  return findDeep(
    flatten(
      map(collection, children).filter(Boolean)
    ),
    predicate,
    { fromIndex, children }
  )
}
