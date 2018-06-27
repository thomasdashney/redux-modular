import createAction from '../create-action'
import { isArray, isString } from '../util/type-utils'

export default function globalizeActions (pathToState, actions) {
  if (isArray(pathToState)) {
    pathToState = pathToState.join('.')
  } else if (pathToState !== null && !isString(pathToState)) {
    throw new Error('path must be a string or array')
  }

  return Object.keys(actions).reduce((prev, key) => {
    const type = pathToState ? `${key} (${pathToState})` : key

    return Object.assign({}, prev, {
      [key]: createAction(type, actions[key])
    })
  }, {})
}
