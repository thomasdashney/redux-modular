export default function createAction (type, payloadCreator) {
  const actionCreator = (...params) => {
    const action = { type }

    if (payloadCreator) {
      action.payload = payloadCreator(...params)

      if (action.payload instanceof Error) {
        action.error = true
      }
    }

    return action
  }

  actionCreator.toString = () => type

  return actionCreator
}
