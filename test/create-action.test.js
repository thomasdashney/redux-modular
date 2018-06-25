/* eslint-env jest */

import createAction from '../src/action-helpers/create-action'

it('creates an FSA-compliant action creator', () => {
  const someAction = createAction('SOME_TYPE')

  expect(someAction()).toEqual({
    type: 'SOME_TYPE',
    payload: undefined
  })

  const nullPayloadCreator = createAction('SOME_TYPE')

  expect(nullPayloadCreator()).toEqual({
    type: 'SOME_TYPE',
    payload: undefined
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

it('sets error to true if the payload is an instance of Error', () => {
  const someAction = createAction(
    'SOME_TYPE',
    value => value
  )

  expect(someAction('not an error').error).toBeUndefined()
  expect(someAction(new Error('Something happened')).error).toEqual(true)
})
