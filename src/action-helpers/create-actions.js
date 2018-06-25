import createAction from './create-action'
import createType from './create-type'

export default function createActions (actions, pathToState) {
  const TYPE = pathToState === undefined || pathToState === null
    ? type => type
    : createType(pathToState)

  return Object.keys(actions).reduce((prev, key) => {
    return Object.assign({}, prev, {
      [key]: createAction(TYPE(key), actions[key])
    })
  }, {})
}
