export default function createAction (type, payloadCreator) {
  if (!payloadCreator) {
    payloadCreator = () => null
  }

  const actionCreator = (...params) => {
    const payload = payloadCreator(...params)
    const action = { type, payload }

    if (payload instanceof Error) {
      action.error = true
    }

    return action
  }

  actionCreator.toString = () => type

  return actionCreator
}
