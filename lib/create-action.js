export default (type, payloadCreator = () => null, metaCreator = () => null) => {
  const actionCreator = (...params) => ({
    type,
    payload: payloadCreator(...params),
    meta: metaCreator(...params)
  })

  actionCreator.toString = () => type

  actionCreator._payloadCreator = payloadCreator
  actionCreator._metaCreator = metaCreator

  return actionCreator
}
