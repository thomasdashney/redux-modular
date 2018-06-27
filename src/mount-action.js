import createAction from './create-action'
import { validatePath } from './util/arg-validators'
import { isArray } from './util/type-utils'

export default function mountAction (path, action) {
  if (path === null) {
    return action
  }

  if (!validatePath(path)) {
    throw new Error('path must be a string or array of strings')
  }

  if (isArray(path)) {
    path = path.join('.')
  }

  return createAction(`${action.toString()} (${path})`, action.payloadCreator)
}
