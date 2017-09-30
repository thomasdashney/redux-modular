import createAction from './create-action'

export default (actionCreator, newType) => {
  const clone = createAction(
    newType,
    actionCreator._payloadCreator,
    actionCreator._metaCreator
  )

  clone._type = actionCreator._type

  return clone
}
