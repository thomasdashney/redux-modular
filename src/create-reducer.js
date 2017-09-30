export default (initialState, reducersByAction) => {
  const reducer = (state = initialState, action) => {
    const { type } = action

    if (reducersByAction[type]) {
      return reducersByAction[type](state, action.payload)
    } else {
      return state
    }
  }

  reducer._initialState = initialState
  reducer._reducersByAction = reducersByAction
  reducer._type = 'createReducer'
  return reducer
}
