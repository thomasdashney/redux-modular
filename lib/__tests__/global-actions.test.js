/* eslint-env jest */

import globalActions from '../global-actions'

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

  actions = globalActions(null, { increment: () => null })
  expect(actions.increment.toString()).toEqual('increment')
})

it('creates actions with payload creators', () => {
  const actions = globalActions(null, {
    increment: (param1, param2) => ({ param1, param2 })
  })

  const action = actions.increment('test1', 'test2')
  expect(action).toHaveProperty('payload')
  expect(action.payload).toEqual({
    param1: 'test1',
    param2: 'test2'
  })
})
