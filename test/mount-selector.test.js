/* eslint-env jest */

import mountSelector from '../src/mount-selector'

it('wraps a given selector to a given path', () => {
  const selector1 = mountSelector('path', state => state.key)
  expect(selector1({ path: { key: 'value' } })).toEqual('value')

  const selector2 = mountSelector('nested.path', state => state.key)
  expect(selector2({ nested: { path: { key: 'value' } } })).toEqual('value')

  const selector3 = mountSelector(['nested', 'path'], state => state.key)
  expect(selector3({ nested: { path: { key: 'value' } } })).toEqual('value')
})

it('return the original selector if no path is provided', () => {
  const selector = mountSelector(null, state => state.key)
  expect(selector({ key: 'value' })).toEqual('value')
})

it('throws an error if the path to state does not exist', () => {
  const selector = mountSelector('path', state => state)
  expect(() => selector({})).toThrow()
})
