/* eslint-env jest */

import * as reduxModular from '../src/index'

test('exported functions', () => {
  expect(reduxModular).toHaveProperty('mount')
  expect(reduxModular).toHaveProperty('createAction')
  expect(reduxModular).toHaveProperty('createActions')
  expect(reduxModular).toHaveProperty('mountAction')
  expect(reduxModular).toHaveProperty('mountActions')
  expect(reduxModular).toHaveProperty('createReducer')
  expect(reduxModular).toHaveProperty('mountSelector')
  expect(reduxModular).toHaveProperty('mountSelectors')
})
