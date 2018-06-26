/* eslint-env jest */

import * as reduxModular from '../src/index'

it('exports modularize and createReducer', () => {
  expect(reduxModular).toHaveProperty('createLogic')
  expect(reduxModular).toHaveProperty('createType')
  expect(reduxModular).toHaveProperty('createAction')
  expect(reduxModular).toHaveProperty('createActions')
  expect(reduxModular).toHaveProperty('createReducer')
  expect(reduxModular).toHaveProperty('createSelectors')
})
