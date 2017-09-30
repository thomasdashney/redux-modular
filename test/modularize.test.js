/* eslint-env jest */

import { combineReducers } from 'redux'
import createReducer from '../src/create-reducer'
import modularize from '../src/modularize'

it('enables dynamic modularization of actions', () => {
  const createLogic = modularize({
    actions: {
      increment: () => null
    }
  })

  const logic = createLogic('path.to.module')
  expect(logic).toHaveProperty('actions')
  expect(logic.actions).toHaveProperty('increment')
  expect(
    logic.actions.increment.toString()
  ).toEqual('increment (path.to.module)')
})

it('enables dynamic modularization of reducers to actions', () => {
  const createLogic = modularize({
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
  })
  const logic = createLogic('path.to.module')
  expect(logic).toHaveProperty('reducer')

  const { reducer, actions } = logic

  expect(reducer({ value: 1 }, actions.increment())).toEqual({ value: 2 })
  expect(reducer({ value: 5 }, { type: 'SET_TO_0' })).toEqual({ value: 0 })
})

it('enables dynamic modularization of selectors', () => {
  const logic = modularize({
    selectors: localSelector => ({
      mySelector: state => localSelector(state)
    })
  })('nested.path')

  expect(logic).toHaveProperty('selectors')
  expect(logic.selectors).toHaveProperty('mySelector')
  const state = {
    nested: {
      path: { modularized: 'state' }
    }
  }
  expect(logic.selectors.mySelector(state)).toEqual({ modularized: 'state' })
})

it('throws an error if no params are passed', () => {
  expect(() => {
    modularize()
  }).toThrow(Error)
})
