import { isObject } from '../utils'

export default function createReducer (initialState, reducersByAction) {
  if (!isObject(reducersByAction)) {
    throw new Error('createReducer requires an object as its second argument')
  }

  return (state = initialState, action) => {
    const reducer = reducersByAction[action.type]
    return reducer ? reducer(state, action.payload) : state
  }
}
