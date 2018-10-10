/* eslint-env jest */

import mountSelectors from '../src/mount-selectors'

const selectors = {
  selector1: state => state.key1,
  selector2: state => state.key2
}

it('mounts an object of selectors to a given path', () => {
  const mountedSelectors = mountSelectors('path', selectors)
  expect(mountedSelectors.selector1({ path: { key1: 'value' } })).toEqual('value')
  expect(mountedSelectors.selector2({ path: { key2: 'value' } })).toEqual('value')
})
