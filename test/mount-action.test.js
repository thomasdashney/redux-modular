/* eslint-env jest */

import createAction from '../src/create-action'
import mountAction from '../src/mount-action'

const action = createAction('test', () => 'payloadValue')

it('mounts an action to a given path', () => {
  const mountedAction = mountAction('path', action)
  expect(mountedAction.toString()).toEqual('test (path)')
  expect(mountedAction().payload).toEqual('payloadValue')
})

it('can mount to an array of strings', () => {
  const mountedAction = mountAction(['nested', 'path'], action)
  expect(mountedAction.toString()).toEqual('test (nested.path)')
})

it('can mount to a path of null', () => {
  const mountedAction = mountAction(null, action)
  expect(mountedAction).toEqual(action)
})

it('throws an error if the path is invalid', () => {
  expect(() => mountAction(5, action)).toThrow()
})
