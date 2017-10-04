export default (type, payloadCreator) => {
  if (!payloadCreator) {
    payloadCreator = () => null
  }

  const actionCreator = (...params) => ({
    type,
    payload: payloadCreator(...params)
  })

  actionCreator.toString = () => type

  return actionCreator
}
