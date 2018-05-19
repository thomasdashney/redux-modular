export default function createReducer (initialState, reducersByAction) {
  return (state = initialState, action) => {
    const reducer = reducersByAction[action.type]
    return reducer ? reducer(state, action.payload) : state
  }
}
