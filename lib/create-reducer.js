export default (initialState, reducersByAction) => {
  return (state = initialState, action) => {
    const { type } = action

    if (reducersByAction[type]) {
      return reducersByAction[type](state, action.payload)
    } else {
      return state
    }
  }
}
