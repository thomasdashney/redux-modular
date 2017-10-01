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

Creating a module:

```js
import { combineReducers, createStore } from 'redux'
import { mount, createReducer } from 'redux-modular'

// create an object containing the logic (actions, reducer, selectors)

const counterLogic = {
  actions: {
    increment: () => null,
    decrement: () => null,
    set: value => value
  },

  reducer: actions => createReducer(0, {
    [actions.increment]: state => state + 1,
    [actions.decrement]: state => state - 1,
    [actions.set]: (_, value) => value
  }),

  selectors: localStateSelector => ({
    counterValue: localStateSelector
  })
}

// mount the logic to its redux path

const myCounter = mount('myCounter', counterLogic)

// add reducer to root reducer

const rootReducer = combineReducers({
  myCounter: myCounter.reducer
})

const store = createStore(rootReducer)

// use actions and selectors in your app

const { actions, selectors } = myCounter

selectors.counterValue(store.getState()) // 0

store.dispatch(actions.increment())
selectors.counterValue(store.getState()) // 1

store.dispatch(actions.decrement())
selectors.counterValue(store.getState()) // 0

store.dispatch(actions.set(5))
selectors.counterValue(store.getState()) // 5
```
