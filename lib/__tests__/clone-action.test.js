/* eslint-env jest */

import createAction from '../create-action'
import cloneAction from '../clone-action'

it('maintains functionality', () => {
  const action = createAction('SOME_TYPE', param => ({ param }))
  const cloned = cloneAction(action)
  expect(cloned(1)).toEqual({
    type: 'SOME_TYPE',
    payload: { param: 1 },
    meta: null
  })

  expect(cloned.toString()).toEqual('SOME_TYPE')
})

it('allows the type to be set without affecting the original action', () => {
  const action = createAction('FIRST')
  const cloned = cloneAction(action)
  cloned.setType('SECOND')
  expect(action.toString()).toEqual('FIRST')
  expect(cloned.toString()).toEqual('SECOND')
})

it('maintains properties', () => {
  const action = createAction('TYPE')
  action._type = 'meta'
  const cloned = cloneAction(action)
  expect(cloned._type).toEqual('meta')
})
