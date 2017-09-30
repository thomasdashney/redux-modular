/* eslint-env jest */

import * as reduxModular from '../src/index'

it('exports modularize and createReducer', () => {
  expect(reduxModular).toHaveProperty('modularize')
  expect(reduxModular).toHaveProperty('createReducer')
})
