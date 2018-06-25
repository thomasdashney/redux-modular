/* eslint-env jest */

import { combineReducers } from 'redux'
import createReducer from '../src/reducer-helpers/create-reducer'
import mount from '../src/mount'

it('mounts redux path to action types', () => {
  const logic = mount({
    actions: {
      increment: () => null
    }
  }, 'path.to.module')

  expect(logic).toHaveProperty('actions')
  expect(logic.actions).toHaveProperty('increment')
  expect(
    logic.actions.increment.toString()
  ).toEqual('increment (path.to.module)')
})

it('configures the reducer with the mounted actions', () => {
  const logic = mount({
    actions: {
      increment: () => null
    },
    reducer: actions => {
      return combineReducers({
        value: createReducer(0, {
          [actions.increment]: prev => prev + 1,
          'SET_TO_0': () => 0
        })
      })
    }
  }, 'path.to.module')
  expect(logic).toHaveProperty('reducer')

  const { reducer, actions } = logic

  expect(reducer({ value: 1 }, actions.increment())).toEqual({ value: 2 })
  expect(reducer({ value: 5 }, { type: 'SET_TO_0' })).toEqual({ value: 0 })
})

it('creates selectors using the correct state selector', () => {
  ['nested.path', ['nested', 'path']].forEach(pathString => {
    const logic = mount({
      selectors: {
        mySelector: state => state.key
      }
    }, pathString)

    expect(logic).toHaveProperty('selectors')
    expect(logic.selectors).toHaveProperty('mySelector')
    const state = {
      nested: {
        path: { key: 'value' }
      }
    }
    expect(logic.selectors.mySelector(state)).toEqual('value')
  })
})

it('can create selectors with no pathToState', () => {
  const logic = mount({
    selectors: {
      mySelector: state => state.value
    }
  })

  expect(logic).toHaveProperty('selectors')
  expect(logic.selectors).toHaveProperty('mySelector')
  const state = {
    value: 'test'
  }
  expect(logic.selectors.mySelector(state)).toEqual('test')
})

it('throws an error if no params are passed', () => {
  expect(mount).toThrow(Error)
})
