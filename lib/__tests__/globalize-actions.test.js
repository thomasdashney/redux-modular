/* eslint-env jest */

import globalizeActions from '../globalize-actions'
import createActions from '../create-actions'

it('creates actions with types including the state path', () => {
  let actions = globalizeActions('path.to.state', {
    increment: () => null
  })
  expect(actions).toHaveProperty('increment')
  expect(actions.increment.toString()).toEqual('increment (path.to.state)')

  actions = globalizeActions(['path', 'to', 'state'], {
    increment: () => null
  })
  expect(actions.increment.toString()).toEqual('increment (path.to.state)')
})

it('creates actions with payload creators', () => {
  const actions = globalizeActions('path.to.state', {
    increment: (param1, param2) => ({ param1, param2 })
  })

  const action = actions.increment('test1', 'test2')
  expect(action).toHaveProperty('payload')
  expect(action.payload).toEqual({
    param1: 'test1',
    param2: 'test2'
  })
})

it('works with actions created with createActions', () => {
  const actions = createActions({
    increment: (param1, param2) => ({ param1, param2 })
  })

  const globalizedActions = globalizeActions('path.to.state', actions)
  expect(globalizedActions).toHaveProperty('increment')
  expect(globalizedActions.increment.toString()).toEqual('increment (path.to.state)')
  expect(globalizedActions.increment('test1', 'test2').payload).toEqual({
    param1: 'test1',
    param2: 'test2'
  })
})