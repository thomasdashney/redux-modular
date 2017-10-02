/* eslint-env jest */

import * as reduxModular from '../src/index'

it('exports modularize and createReducer', () => {
  expect(reduxModular).toHaveProperty('mount')
  expect(reduxModular).toHaveProperty('createReducer')
  expect(reduxModular).toHaveProperty('createAction')
})
