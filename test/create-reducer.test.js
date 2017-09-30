/* eslint-env jest */

import createReducer from '../src/create-reducer'
import createAction from '../src/create-action'

it('sets initial state', () => {
  const initialState = { initial: 'state' }
  const reduce = createReducer(initialState, {})
  expect(reduce(undefined, { type: '@@INIT' })).toEqual(initialState)
})

it('modifies state based on action types', () => {
  const INCREMENT = 'INCREMENT'
  const DECREMENT = 'DECREMENT'
  const increment = createAction(INCREMENT)
  const decrement = createAction(DECREMENT)

  const reduce = createReducer(0, {
    [INCREMENT]: (prev) => prev + 1,
    [DECREMENT]: (prev) => prev - 1
  })

  expect(reduce(1, increment())).toEqual(2)
  expect(reduce(2, decrement())).toEqual(1)
})

it('modifies state based on action creators', () => {
  const increment = createAction('INCREMENT')
  const decrement = createAction('DECREMENT')

  const reduce = createReducer(0, {
    [increment]: (prev) => prev + 1,
    [decrement]: (prev) => prev - 1
  })

  expect(reduce(1, increment())).toEqual(2)
  expect(reduce(2, decrement())).toEqual(1)
})

it('returns the previous state given an unknown action', () => {
  const reduce = createReducer(0, {
    EXPECTED: prev => prev + 1
  })

  expect(reduce(1, { type: 'UNEXPECTED' })).toEqual(1)
})
