export default (initialState, reducersByAction) => {
  const reducer = (state = initialState, action) => {
    const { type } = action

    const reducer = reducersByAction[type]

    if (reducer) {
      return reducer(state, action.payload)
    } else {
      return state
    }
  }

  return reducer
}
