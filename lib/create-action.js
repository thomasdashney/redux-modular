export default (type, payloadCreator = () => null, metaCreator = () => null) => {
  const actionCreator = (...params) => ({
    type,
    payload: payloadCreator(...params),
    meta: metaCreator(...params)
  })

  actionCreator.toString = () => type

  return actionCreator
}
