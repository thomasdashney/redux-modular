/* eslint-env jest */

import createAction from '../src/create-action'
import cloneAction from '../src/clone-action'

it('maintains functionality', () => {
  const action = createAction('SOME_TYPE', param => ({ param }))
  const cloned = cloneAction(action, 'SOME_TYPE')
  expect(cloned(1)).toEqual({
    type: 'SOME_TYPE',
    payload: { param: 1 }
  })

  expect(cloned.toString()).toEqual('SOME_TYPE')
})

it('allows the type to be set without affecting the original action', () => {
  const action = createAction('FIRST')
  const cloned = cloneAction(action, 'SECOND')
  expect(action.toString()).toEqual('FIRST')
  expect(cloned.toString()).toEqual('SECOND')
  expect(action().type).toEqual('FIRST')
  expect(cloned().type).toEqual('SECOND')
})

it('maintains _type property', () => {
  const action = createAction('TYPE')
  const cloned = cloneAction(action)
})
