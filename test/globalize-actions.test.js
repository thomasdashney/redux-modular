/* eslint-env jest */

import globalizeActions from '../src/globalize-actions'

it('creates actions with types including the state path', () => {
  let actions = globalizeActions('path.to.state', {
    increment: null
  })
  expect(actions).toHaveProperty('increment')
  expect(actions.increment.toString()).toEqual('increment (path.to.state)')

  actions = globalizeActions(['path', 'to', 'state'], {
    increment: null
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

it('throws an error if pathToState is invalid', () => {
  const actions = { increment: () => null }

  expect(() => globalizeActions(null, actions)).toThrow()
  expect(() => globalizeActions(5, actions)).toThrow()
  expect(() => globalizeActions({}, actions)).toThrow()
})
