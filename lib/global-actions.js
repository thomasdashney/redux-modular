import createAction from './create-action'
import cloneAction from './clone-action'

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
    const type = pathToState ? `${key} (${pathToState})` : key

    let action = actions[key]
    if (action._type === 'localizedActionCreator') {
      action = cloneAction(actions[key], type)
    } else {
      action = createAction(type, actions[key])
    }

    return {
      ...prev,
      [key]: action
    }
  }, {})
}
