import createAction from './create-action'

const isArray = value => {
  return typeof value === 'object' &&
         value !== null &&
         value.constructor === Array
}
const isString = value => typeof value === 'string'

export default (pathToState, actions) => {
  if (isArray(pathToState)) {
    pathToState = pathToState.join('.')
  } else if (!isString(pathToState)) {
    throw new Error('path must be a string or array')
  }

  return Object.keys(actions).reduce((prev, key) => {
    const type = `${key} (${pathToState})`

    return Object.assign({}, prev, {
      [key]: createAction(type, actions[key])
    })
  }, {})
}
