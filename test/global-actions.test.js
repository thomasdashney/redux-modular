/* eslint-env jest */

import globalActions from '../src/global-actions'
import createActions from '../src/create-actions'

it('creates actions with types including the state path', () => {
  let actions = globalActions('path.to.state', {
    increment: () => null
  })
  expect(actions).toHaveProperty('increment')
  expect(actions.increment.toString()).toEqual('increment (path.to.state)')

  actions = globalActions(['path', 'to', 'state'], {
    increment: () => null
  })
  expect(actions.increment.toString()).toEqual('increment (path.to.state)')
})

it('creates actions with payload creators', () => {
  const actions = globalActions('path.to.state', {
    increment: (param1, param2) => ({ param1, param2 })
  })

  const action = actions.increment('test1', 'test2')
  expect(action).toHaveProperty('payload')
  expect(action.payload).toEqual({
    param1: 'test1',
    param2: 'test2'
  })
})

it('interopts with actions created with createActions', () => {
  const actions = createActions({
    increment: (param1, param2) => ({ param1, param2 })
  })

  const globalizedActions = globalActions('path.to.state', actions)
  expect(globalizedActions).toHaveProperty('increment')
  expect(globalizedActions.increment.toString()).toEqual('increment (path.to.state)')
  expect(globalizedActions.increment('test1', 'test2').payload).toEqual({
    param1: 'test1',
    param2: 'test2'
  })
})

it('throws an error if pathToState is invalid', () => {
  const actions = { increment: () => null }

  expect(() => globalActions(null, actions)).toThrow()
  expect(() => globalActions(5, actions)).toThrow()
  expect(() => globalActions({}, actions)).toThrow()
})
