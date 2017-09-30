# redux-modular

Helpers for scaling and abstracting redux by co-locating actions, reducers and selectors.

[![Build Status](https://travis-ci.org/thomasdashney/redux-modular.svg?branch=master)](https://travis-ci.org/thomasdashney/redux-modular)

## Install

```
$ npm install --save https://github.com/thomasdashney/redux-modular
```

or

```
$ yarn add https://github.com/thomasdashney/redux-modular
```

## Usage

Creating a module:

```js
import { combineReducers, createStore } from 'redux'
import { modularize, createReducer } from 'redux-modular'

// create a module

const createCounter = modularize({
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
    counterValue: state => localStateSelector(state)
  })
})

// instantiate the module with the path

const myCounter = createCounter('myCounter')

// mount instance to root reducer

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
