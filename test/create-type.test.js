/* eslint-env jest */

import createType from '../src/action-helpers/create-type'

it('given a string or array, returns a function that can be use to create namespaced types', () => {
  const testType = createType('path')
  expect(testType('action')).toEqual('action (path)')

  const testType2 = createType(['nested', 'path'])
  expect(testType2('action')).toEqual('action (nested.path)')
})

it('throws an error if the argument is invalid', () => {
  expect(() => createType()).toThrow()
  expect(() => createType(null)).toThrow()
  expect(() => createType({})).toThrow()
  expect(() => createType([{}])).toThrow()
})
