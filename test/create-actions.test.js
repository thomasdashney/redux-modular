/* eslint-env jest */

import createActions from '../src/create-actions'

it('creates an object of action creators given an object of payload creators', () => {
  let actions = createActions({
    testAction: null
  })

  expect(actions).toHaveProperty('testAction')
  expect(actions.testAction.toString()).toEqual('testAction')

  actions = createActions({
    testAction: value => value
  })
  expect(actions.testAction('testValue').payload).toEqual('testValue')
})
