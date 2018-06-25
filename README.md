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

This guide illustrates how to use each helper function using a `counter` redux store. You can dispatch `increment`, `decrement`, and `setValue` actions to a reducer that creates the store state.

* [Defining actions](#defining-actions)
* [Defining reducers](#defining-reducers)
* [Defining selectors](#defining-selectors)
* [Defining reusable redux logic](#defining-reusable-redux-logic)
* [Writing tests](#writing-tests)

### Defining actions

#### `createType(String|Array pathToState)`

`createType` allows you to create a **type creator**, allowing you to easily create types under a unique namespace:

```js
import { createType } from 'redux-modular'

const COUNTER_TYPE = createType('counter')

const INCREMENT_TYPE = COUNTER_TYPE('increment')
console.log(INCREMENT_TYPE) // prints `increment (counter)`
```

#### `createAction(String|Array pathToState, [Function payloadCreator])`

defines [FSA-compliant](https://github.com/redux-utilities/flux-standard-action) action creators using `createAction`:

```js
import { createAction } from 'redux-modular'

const increment = createAction('increment')
console.log(increment()) // prints `{ type: 'INCREMENT' }`

const setValue = createAction('setValue', value => ({ value })
console.log(setValue()) // prints `{ type: 'SET_VALUE', payload: {  } }`
```

The action type for a given action creator can be provided by calling `toString()` on the action creator:

```js
console.log(increment.toString()) // prints `increment`
```

#### `createActions(Object actionsToPayloadCreators, [String|Array pathToState])`

Combined with `createAction`, you can quickly generate an object of action creators:

```js
import { createType, createAction } from 'redux-modular'

const COUNTER_TYPE = createType('counter')
const counterActions = {
  increment: createAction(COUNTER_TYPE('increment')),
  decrement: createAction(COUNTER_TYPE('decrement')),
  setValue: createAction(COUNTER_TYPE('setValue'), value => ({ value }))
}
```

`createActions` can be used to simplify the above:

```js
import { createActions } from 'redux-modular'

const counterActions = createActions({
  increment: null,
  decrement: null,
  setValue: value => ({ value })
}, 'counter')
```

### Defining reducers

`createReducer(Any initialState, Object actionTypesToReducerHandlers)`

This function will return a reducer that maps action types to handlers, so that whenever this reducer is called with an action of a given type, the corresponding sub-reducer will be called:

```js
import { createReducer } from 'redux-modular'

const counterReducer = createReducer(0, {
  'increment': state => state + 1,
  'decrement': state => state - 1,
  'setValue': (state, payload) => payload.value
})

console.log(counterReducer(undefined, { type: '@@INIT' })) // prints initial state of `0`
console.log(counterReducer(0, { type: 'increment' })) // prints `1`
```

This is very useful if used conjunction with actions created using our actions created using `createAction` or `createActions`:

```js
const counterReducer = createReducer(0, {
  [counterActions.increment]: state => state + 1,
  [counterActions.decrement]: state => state - 1,
  [counterActions.setValue]: (state, payload) => payload.value
})

console.log(counterReducer(0, counterActions.increment())) // prints `1`
console.log(counterReducer(0, counterActions.setValue(5))) // prints `5`
```

### Defining selectors

Rather than having to select data directly from the redux state tree, you can define "selector" functions. These can help to increase code maintainability by reducing access to redux state to these functions, serving as a public API to the state tree.

`createSelectors(Object selectorFunctions, [String|Array pathToState])`

This function can be used to create an object of selector functions. Given a path to the state, which will be run through [`lodash.get`](https://lodash.com/docs/4.17.10#get), and an object of selector functions, it will return a new object of selector functions. The returned selector functions will first run `lodash.get(state, 'some.path')`, and then pass this value to your provided selector function. This can be useful for easily defining selectors.

Suppose we want our counter logic to live at `state.counter1`, we can define a "value" selector as shown:

```js
import { createSelectors } from 'redux-modular'

const counterSelectors = createSelectors({
  value: state => state.value
}, 'counter1')

console.log(counterSelectors.value({ counter1: { value: 5 } })) // prints `5`
```

If the counter lives multiple levels deep in the redux state, you can use [`lodash.get`](https://lodash.com/docs/4.17.10#get) syntax to pass an array or string path to the state:

```js
const counterSelectors = createSelectors({
  value: state => state.value
}, 'nested.counter3')

console.log(counterSelectors.value({ nested: { counter3: { value: 5 } } })) // prints `5`
```

This can also be used with the [`reselect`](https://github.com/reduxjs/reselect) library value to create memoized, computed selector functions:

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

console.log(counterSelectors.asPercentageOfOneHundred({ counter1: { value: 5 } } })) // prints `0.05`
```

### Defining reusable redux logic

You can define related actions, selectors and reducer logic in an object. The `mount` function can be used to convert these into corresponding actions, selectors and reducer into usable versions. This is useful if you want to define logic once, and use it multiple places. It is also usable for reducing the boilerplate of defining a related group of redux elements.

As parameters, `mount` takes a redux state path, and an object of the following:
* `actions` is an object that will be run through `createActions`
* `reducer` is a function which, given the actions returned by `createActions`, returns a reducer.
* `selectors` is an object that will be run through `createSelectors`

<p align="center">
  <img src="https://raw.githubusercontent.com/thomasdashney/redux-modular/master/counter-example.png" />
</p>

```js
import { combineReducers, createStore } from 'redux'
import { mount, createReducer } from 'redux-modular'

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
  selectors: localStateSelector => ({
    counterValue: state => localStateSelector(state)
  })
}

/* Instantiate the counter logic by mounting to redux paths */

const counter1 = mount('counter1', counter)
const counter2 = mount('counter2', counter)
const counter3 = mount(['nested', 'counter3'], counter)

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

console.log(selectors.counterValue(store.getState())) // prints `0`

store.dispatch(actions.increment())
console.log(selectors.counterValue(store.getState())) // prints `1`

store.dispatch(actions.decrement())
console.log(selectors.counterValue(store.getState())) // prints `0`

store.dispatch(actions.setValue(5))
console.log(selectors.counterValue(store.getState())) // prints `5`
```

### Writing Tests

If you `mount` your logic to a path of `null`, you can test your state logic without any assumption of where it sits in your redux state. Using these `actions`, `selectors` and `reducer`, you can test the logic by running actions through the reducer, and making assertions about the return value of selectors.

```js
/* eslint-env jest */
const {
  counterActions,
  counterReducer,
  counterSelectors
} = require('./counter-logic')

it('can increment', () => {
  const state = reducer(0, actions.increment())
  expect(selectors.counterValue(state)).toEqual(1)
})

it('can decrement', () => {
  const state = reducer(0, actions.decrement())
  expect(selectors.counterValue(state)).toEqual(-1)
})

it('can be set to a number', () => {
  const state = reducer(0, actions.setValue(5))
  expect(selectors.counterValue(state)).toEqual(5)
})
```
