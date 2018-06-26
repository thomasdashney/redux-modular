# redux-modular

Helpers for scaling and abstracting redux by co-locating actions, reducers and selectors.

[![Build Status](https://travis-ci.org/thomasdashney/redux-modular.svg?branch=master)](https://travis-ci.org/thomasdashney/redux-modular) [![Test Coverage](https://codeclimate.com/github/thomasdashney/redux-modular/badges/coverage.svg)](https://codeclimate.com/github/thomasdashney/redux-modular/coverage) [![Code Climate](https://codeclimate.com/github/thomasdashney/redux-modular/badges/gpa.svg)](https://codeclimate.com/github/thomasdashney/redux-modular)


## Install

```
$ npm install --save redux-modular
```

or

```
$ yarn add redux-modular
```

## Usage Guide

* [Defining actions](#defining-actions)
* [Defining reducers](#defining-reducers)
* [Defining selectors](#defining-selectors)
* [Defining reusable redux logic](#defining-reusable-redux-logic)
* [Writing tests](#writing-tests)

### Defining actions

#### `createType(String|Array<String> pathToState)`

Creates a **type creator** - a helper for creating action types under a namespace:

```js
import { createType } from 'redux-modular'

const COUNTER_TYPE = createType('counter')
COUNTER_TYPE('increment') // 'increment (counter)'

const COUNTER_TYPE = createType(['path', 'to', 'counter'])
COUNTER_TYPE('increment') // 'increment (path.to.counter)'
```

#### `createAction(String|Array<String> type, [Function payloadCreator])`

Creates an [FSA-compliant](https://github.com/redux-utilities/flux-standard-action) action creator:

```js
import { createAction } from 'redux-modular'

const increment = createAction('increment')
increment() // { type: 'increment' }

const setValue = createAction('setValue', value => ({ value })
setValue(value) // { type: 'setValue', payload: { value } }
```

`actionCreator.toString()` returns the action type:

```js
increment.toString() // 'increment'
```

#### `createActions(Object<String, Function> actionsToPayloadCreators, [String|Array<String> pathToState])`

Creates an object of action creators using the key as the action `type`:

```js
import { createActions } from 'redux-modular'

const counterActions = createActions({
  increment: null,
  decrement: null,
  setValue: value => ({ value })
})

counterActions.increment() // { type: 'increment' }
```

If you would like to namespace the actions via `createType`, you can pass a second parameter:

```js
const counterActions = createActions({
  increment: null,
  decrement: null,
  setValue: value => ({ value })
}, 'counter')

counterActions.increment() // { type: 'increment (counter)' }
```

### Defining reducers

#### `createReducer(Any initialState, Object<String, Function> actionTypesToReducers)`

Given an initial state and mapping of action types to reducer functions, will return a new reducer:

```js
import { createReducer } from 'redux-modular'

const counterReducer = createReducer(0, {
  increment: state => state + 1,
  decrement: state => state - 1,
  setValue: (state, payload) => payload.value
})

counterReducer(undefined, { type: '@@INIT' }) // 0 (initial state)
counterReducer(0, { type: 'increment' }) // 1
```

This is very useful in conjunction with actions created using `createAction` or `createActions`:

```js
const counterReducer = createReducer(0, {
  [counterActions.increment]: state => state + 1,
  [counterActions.decrement]: state => state - 1,
  [counterActions.setValue]: (state, payload) => payload.value
})

counterReducer(0, counterActions.increment()) // 1
counterReducer(0, counterActions.setValue(5)) // 5
```

### Defining selectors

Rather than having to select data directly from the redux state tree, you can define "selector" functions. These help to increase code maintainability by reducing access to redux state to these functions, serving as a public API to the state tree.

#### `createSelectors(Object<String, Function> selectorFunctions, [String|Array<String> pathToState])`

This function can be used to create an object of selector functions. Given an object of selector functions, as well as a path to the state, it will return a new object of selector functions.

Suppose we want our counter logic to live at `state.myCounter`. We can set up our `counter` reducer in our root reducer via `combineReducers`. Using `createSelectors`, we can create selector functions that select directly from our `counter` state given the full redux state as an argument:

```js
import { combineReducers } from 'redux'
import { createSelectors } from 'redux-modular'

// create selectors

const counterSelectors = createSelectors({
  value: state => state.value
}, 'myCounter')

// create root reducer and state

const rootReducer = combineReducers({
  myCounter: counterReducer
})

const state = rootReducer(undefined, counterActions.setValue(5))

// select the counter value from state

counterSelectors.value(state) // 5
```

If the counter lives multiple levels deep in the redux state, you can use [`lodash.get`](https://lodash.com/docs/4.17.10#get) syntax to pass an array or string path to the state:

```js
const rootReducer = combineReducers({
  nested: combineReducers({
    myCounter: counterReducer
  })
})

const counterSelectors = createSelectors({
  value: state => state.value
}, 'nested.myCounter')

const state = rootReducer(undefined, counterActions.setValue(5))

counterSelectors.value(state) // 5
```

The [`reselect`](https://github.com/reduxjs/reselect) library can be helpful to create memoized, computed selector functions:

```js
import { createSelectors } from 'redux-modular'
import { reselect } from 'redux-modular'

const counterSelectors = createSelectors({
  asPercentageOfOneHundred: createSelector(
    state => state.value,
    value => {
      return value / 100.0
    }
  )
}, 'counter1')

counterSelectors.asPercentageOfOneHundred({ counter1: { value: 5 } } }) // 0.05
```

### Defining reusable redux logic

#### createLogic(Object<String, Object>, String|Array<String> pathToState)

You can define related actions, selectors and reducer logic in an object. The `createLogic` function is an abstraction over `createActions` and `createSelectors`, allowing you to minimally define related actions, selectors and a reducer. This is useful for reducing boilerplate for a set of redux logic, but also making easy it easy to include the logic in multiple places.

As parameters, `createLogic` takes a redux state path, and an object of the following:
* `actions` is an object that will be run through `createActions`
* `reducer` is a function which, given the actions returned by `createActions`, returns a reducer.
* `selectors` is an object that will be run through `createSelectors`

<p align="center">
  <img src="https://raw.githubusercontent.com/thomasdashney/redux-modular/master/counter-example.png" />
</p>

```js
import { combineReducers, createStore } from 'redux'
import { createLogic, createReducer } from 'redux-modular'

/* Create an object containing the logic (actions, reducer, selectors) */

const counter = {
  // mapping of action names to optional payload creators
  actions: {
    increment: null,
    decrement: null,
    setValue: (value) => ({ value })
  },

  // function mapping actions to reducers
  reducer: actions => createReducer(0, {
    [actions.increment]: state => state + 1,
    [actions.decrement]: state => state - 1,
    [actions.setValue]: (state, payload) => payload.value
  }),

  // function mapping local state selector to your selectors
  selectors: {
    value: state => state
  }
}

/* Instantiate the counter logic to a given redux path */

const counter1 = createLogic(counter, 'counter1')
const counter2 = createLogic(counter, 'counter2')
const counter3 = createLogic(counter, ['nested', 'counter3'])

/* Add the reducers to your root reducer */

const rootReducer = combineReducers({
  counter1: counter1.reducer,
  counter2: counter2.reducer,
  nested: combineReducers({
    counter3: counter3.reducer
  })
})

const store = createStore(rootReducer)

/* Use actions and selectors for each counter instance in your app */

const { actions, selectors } = counter1

selectors.value(store.getState()) // 0

store.dispatch(actions.increment())
selectors.value(store.getState()) // 1

store.dispatch(actions.decrement())
selectors.value(store.getState()) // 0

store.dispatch(actions.setValue(5))
selectors.value(store.getState()) // 5
```

### Writing Tests

An easy, minimal way to test your logic is by running `actions` through the `reducer`, and making assertions about the return value of `selectors`.

```js
/* eslint-env jest */
it('can increment', () => {
  const state = reducer(0, actions.increment())
  expect(selectors.value(state)).toEqual(1)
})

it('can decrement', () => {
  const state = reducer(0, actions.decrement())
  expect(selectors.value(state)).toEqual(-1)
})

it('can be set to a number', () => {
  const state = reducer(0, actions.setValue(5))
  expect(selectors.value(state)).toEqual(5)
})
```
