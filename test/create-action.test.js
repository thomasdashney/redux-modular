/* eslint-env jest */

import createAction from '../src/create-action'

it('creates an FSA-compliant action creator', () => {
  const someAction = createAction('SOME_TYPE')

  expect(someAction()).toEqual({
    type: 'SOME_TYPE',
    payload: null
  })
})

it('allows null to be passed as the payload creator', () => {
  const someAction = createAction('SOME_TYPE', null)

  expect(someAction()).toEqual({
    type: 'SOME_TYPE',
    payload: null
  })
})

it('creates the action using optional payload creator', () => {
  const someAction = createAction(
    'SOME_TYPE',
    (param1, param2) => ({ param1, param2 })
  )

  expect(
    someAction('test1', 'test2')
  ).toEqual({
    type: 'SOME_TYPE',
    payload: {
      param1: 'test1',
      param2: 'test2'
    }
  })
})

it('exposes the action type via toString', () => {
  const TYPE = 'SOME_TYPE'
  expect(createAction(TYPE).toString()).toEqual(TYPE)
})
