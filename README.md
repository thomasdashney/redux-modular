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

## Usage

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
    set: (value) => ({ value })
  },

  // function mapping actions to reducers
  reducer: actions => createReducer(0, {
    [actions.increment]: state => state + 1,
    [actions.decrement]: state => state - 1,
    [actions.set]: (state, payload) => payload.value
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

store.dispatch(actions.set(5))
console.log(selectors.counterValue(store.getState())) // prints `5`
```

## Writing Tests

If you `mount` your logic to a path of `null`, you can test your state logic without any assumption of where it sits in your redux state.

```js
/* eslint-env jest */

const counter = require('./counter')

const { actions, reducer, selectors } = mount(null, counter)

it('can increment', () => {
  const state = reducer(0, actions.increment())
  expect(selectors.counterValue(state)).toEqual(1)
})

it('can decrement', () => {
  const state = reducer(0, actions.decrement())
  expect(selectors.counterValue(state)).toEqual(-1)
})

it('can be set to a number', () => {
  const state = reducer(0, actions.set(5))
  expect(selectors.counterValue(state)).toEqual(5)
})
```
