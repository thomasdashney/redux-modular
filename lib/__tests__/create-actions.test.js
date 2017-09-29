/* eslint-env jest */

import createActions from '../create-actions'

it('creates actions with types including the state path', () => {
  let actions = createActions({ increment: () => null })
  expect(actions).toHaveProperty('increment')
  expect(actions.increment.toString()).toEqual('increment')
})

it('creates actions with payload creators', () => {
  const actions = createActions({
    increment: (param1, param2) => ({ param1, param2 })
  })

  const action = actions.increment('test1', 'test2')
  expect(action).toHaveProperty('payload')
  expect(action.payload).toEqual({
    param1: 'test1',
    param2: 'test2'
  })
})

it('sets the _type to localActionCreator', () => {
  const actions = createActions({ increment: () => null })
  expect(actions.increment._type).toEqual('localizedActionCreator')
})
