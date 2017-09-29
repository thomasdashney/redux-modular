import createAction from './create-action'

export default (pathToState, actions) => {
  if (typeof pathToState === 'object' && pathToState !== null && pathToState.constructor === Array) {
    pathToState = pathToState.join('.')
  }

  return Object.keys(actions).reduce((prev, key) => {
    const type = pathToState ? `${key} (${pathToState})` : key

    return {
      ...prev,
      [key]: createAction(type, actions[key])
    }
  }, {})
}
