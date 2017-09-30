export default (reducerMap) => {
  const combinedReducer = (state, action) => {
    return Object.keys(reducerMap).reduce((prev, key) => {
      return {
        ...prev,
        [key]: reducerMap[key](state && state[key], action)
      }
    }, {})
  }
  combinedReducer._reducerMap = reducerMap
  combinedReducer._type = 'combineReducers'
  return combinedReducer
}
