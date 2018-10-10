/* eslint-env jest */

import createActions from '../src/create-actions'
import mountActions from '../src/mount-actions'

const actions = createActions({
  action1: null,
  action2: value => value
})

it('mounts an object of actions to a given path', () => {
  const mountedActions = mountActions('path', actions)
  expect(mountedActions).toHaveProperty('action1')
  expect(mountedActions).toHaveProperty('action2')
  expect(mountedActions.action1.toString()).toEqual('action1 (path)')
  expect(mountedActions.action2.toString()).toEqual('action2 (path)')
})

it('throws an error if the path is invalid', () => {
  expect(() => mountActions(5, actions)).toThrow()
})
