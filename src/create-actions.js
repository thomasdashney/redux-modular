import createAction from './create-action'

export default actions => {
  return Object.keys(actions).reduce((prev, key) => {
    return {
      ...prev,
      [key]: Object.assign(
        createAction(key, actions[key]),
        { _type: 'localizedActionCreator' }
      )
    }
  }, {})
}