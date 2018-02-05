export default (type, payloadCreator) => {
  if (!payloadCreator) {
    payloadCreator = () => null
  }

  const actionCreator = (...params) => {
    const payload = payloadCreator(...params)
    return {
      type,
      payload,
      error: payload instanceof Error ? true : undefined
    }
  }

  actionCreator.toString = () => type

  return actionCreator
}
