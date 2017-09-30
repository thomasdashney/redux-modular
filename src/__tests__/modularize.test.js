/* eslint-env jest */

import combineReducers from '../combine-reducers'
import createActions from '../create-actions'
import createReducer from '../create-reducer'
import modularize from '../modularize'

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
  const localizedActions = createActions({
    increment: () => null
  })

  const localizedReducer = actions => {
    return combineReducers({
      value: createReducer(0, {
        [actions.increment]: prev => prev + 1,
        'SET_TO_0': () => 0
      })
    })
  }
  const createLogic = modularize({ actions: localizedActions, reducer: localizedReducer })
  const logic = createLogic('path.to.module')
  expect(logic).toHaveProperty('reducer')

  const { reducer, actions } = logic
  expect(
    reducer(undefined, { type: '@@INIT' })
  ).toEqual(localizedReducer(localizedActions)(undefined, { type: '@@INIT' }))

  expect(reducer({ value: 1 }, localizedActions.increment())).toEqual({ value: 1 })
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
