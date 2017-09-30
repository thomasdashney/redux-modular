/* eslint-env jest */

import combineReducers from '../combine-reducers'

it('combines reducers', () => {
  const reduce = combineReducers({
    value1: () => 1,
    value2: () => 2
  })

  expect(
    reduce(undefined, { type: '@@INIT' })
  ).toEqual({
    value1: 1,
    value2: 2
  })
})

it('sets the original reducer map on a property', () => {
  const reducerMap = {
    value1: () => 1,
    value2: () => 2
  }

  const combinedReducer = combineReducers(reducerMap)
  expect(combinedReducer._reducerMap).toEqual(reducerMap)
})
