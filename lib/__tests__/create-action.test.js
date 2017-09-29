/* eslint-env jest */

import createAction from '../create-action'

it('creates an FSA-compliant action creator', () => {
  const someAction = createAction('SOME_TYPE')

  expect(
    someAction('test1', 'test2')
  ).toEqual({
    type: 'SOME_TYPE',
    payload: null,
    meta: null
  })
})

it('creates the action using optional payload and meta creators', () => {
  const someAction = createAction(
    'SOME_TYPE',
    (param1, param2) => ({ param1, param2 }),
    (param1, param2) => ({ meta1: param1, meta2: param2 })
  )

  expect(
    someAction('test1', 'test2')
  ).toEqual({
    type: 'SOME_TYPE',
    payload: {
      param1: 'test1',
      param2: 'test2'
    },
    meta: {
      meta1: 'test1',
      meta2: 'test2'
    }
  })
})

it('exposes the action type via toString', () => {
  const TYPE = 'SOME_TYPE'
  expect(createAction(TYPE).toString()).toEqual(TYPE)
})

it('allows the type to be set dynamically', () => {
  const actionCreator = createAction('FIRST')
  actionCreator.setType('SECOND')
  expect(actionCreator.toString()).toEqual('SECOND')
})
