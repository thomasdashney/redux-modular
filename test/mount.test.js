/* eslint-env jest */

import { combineReducers } from 'redux'
import createReducer from '../src/create-reducer'
import mount from '../src/mount'

it('enables dynamic modularization of actions', () => {
  const logic = mount('path.to.module', {
    actions: {
      increment: () => null
    }
  })

  expect(logic).toHaveProperty('actions')
  expect(logic.actions).toHaveProperty('increment')
  expect(
    logic.actions.increment.toString()
  ).toEqual('increment (path.to.module)')
})

it('enables dynamic modularization of reducers to actions', () => {
  const logic = mount('path.to.module', {
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
  expect(logic).toHaveProperty('reducer')

  const { reducer, actions } = logic

  expect(reducer({ value: 1 }, actions.increment())).toEqual({ value: 2 })
  expect(reducer({ value: 5 }, { type: 'SET_TO_0' })).toEqual({ value: 0 })
})

it('enables dynamic modularization of selectors', () => {
  ['nested.path', ['nested', 'path']].forEach(pathString => {
    const logic = mount(pathString, {
      selectors: localSelector => ({
        mySelector: state => localSelector(state)
      })
    })

    expect(logic).toHaveProperty('selectors')
    expect(logic.selectors).toHaveProperty('mySelector')
    const state = {
      nested: {
        path: { mountd: 'state' }
      }
    }
    expect(logic.selectors.mySelector(state)).toEqual({ mountd: 'state' })
  })
})

it('throws an error if no params are passed', () => {
  expect(() => {
    mount()
  }).toThrow(Error)
})
