/* eslint-env jest */

import createSelectors from '../src/selector-helpers/create-selectors'

it('creates an object of selectors', () => {
  const selectorObj = {
    testSelector: state => state.key
  }

  let selectors = createSelectors(selectorObj)
  expect(selectors.testSelector({ key: 'value' })).toEqual('value')

  selectors = createSelectors(selectorObj, 'nested.path')
  expect(selectors.testSelector({ nested: { path: { key: 'value' } } }))

  selectors = createSelectors(selectorObj, ['nested', 'path'])
  expect(selectors.testSelector({ nested: { path: { key: 'value' } } }))
})
