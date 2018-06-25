/* eslint-env jest */

import createActions from '../src/action-helpers/create-actions'

it('creates actions with types including the state path', () => {
  let actions = createActions({
    increment: null
  }, 'path.to.state')
  expect(actions).toHaveProperty('increment')
  expect(actions.increment.toString()).toEqual('increment (path.to.state)')

  actions = createActions({
    increment: null
  }, ['path', 'to', 'state'])
  expect(actions.increment.toString()).toEqual('increment (path.to.state)')
})

it('creates actions with payload creators', () => {
  const actions = createActions({
    increment: (param1, param2) => ({ param1, param2 })
  }, 'path.to.state')

  const action = actions.increment('test1', 'test2')
  expect(action).toHaveProperty('payload')
  expect(action.payload).toEqual({
    param1: 'test1',
    param2: 'test2'
  })
})

it('allows you to skip the second parameter', () => {
  let actions = createActions({ increment: null })
  expect(actions).toHaveProperty('increment')
  expect(actions.increment.toString()).toEqual('increment')
})

it('throws an error if pathToState is invalid', () => {
  const actions = { increment: () => null }
  expect(() => createActions(actions, 5)).toThrow()
})
