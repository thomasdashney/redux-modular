export default (type, payloadCreator = () => null) => {
  const actionCreator = (...params) => ({
    type,
    payload: payloadCreator(...params)
  })

  actionCreator.toString = () => type

  return actionCreator
}
