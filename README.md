# redux-modular

Helpers for scaling and abstracting redux by co-locating actions, reducers and selectors.

[![Build Status](https://travis-ci.org/thomasdashney/redux-modular.svg?branch=master)](https://travis-ci.org/thomasdashney/redux-modular) [![Test Coverage](https://codeclimate.com/github/thomasdashney/redux-modular/badges/coverage.svg)](https://codeclimate.com/github/thomasdashney/redux-modular/coverage) [![Code Climate](https://codeclimate.com/github/thomasdashney/redux-modular/badges/gpa.svg)](https://codeclimate.com/github/thomasdashney/redux-modular)

* [Install](#install)
* [Usage Guide](#usage-guide)
  * [Defining actions](#defining-actions)
  * [Defining reducers](#defining-reducers)
  * [Defining selectors](#defining-selectors)
  * [Defining reusable redux logic](#defining-reusable-redux-logic)
  * [Writing tests](#writing-tests)
* [API](#api)

## Install

```
$ npm install --save redux-modular
```

or

```
$ yarn add redux-modular
```

## Usage Guide

This guide uses a counter as an example, which starts at 0 and ends at 10. If you try to `increment` past the 10, it will stay at 10. Likewise, a `decrement` to below 0 will keep it at 0.

Two selectors are provided: `value` which gets the current value of the counter, and `isComplete`, which return `true` if the counter has reached 10 (the maximum). Finally, there is a `reset` action for resetting back to the initial state of `0`.

Here is how one might implement this using plain redux:

```js
import { createStore, combineReducers } from 'redux'

const INITIAL_STATE = 0
const COUNTER_MIN = 0
const COUNTER_MAX = 10

const COUNTER_TYPES = {
  INCREMENT: 'increment (counter)',
  DECREMENT: 'decrement (counter)',
  RESET: 'reset (counter)'
}

const counterActions = {
  increment: (amount = 1) => ({ type: COUNTER_TYPES.INCREMENT, payload: amount }),
  decrement: (amount = 1) => ({ type: COUNTER_TYPES.DECREMENT, payload: amount }),
  reset: () => ({ type: COUNTER_TYPES.RESET })
}

const counterReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case COUNTER_TYPES.INCREMENT:
      return Math.min(state + action.payload, COUNTER_MAX)
    case COUNTER_TYPES.DECREMENT:
      return Math.max(state - action.payload, COUNTER_MIN)
    case COUNTER_TYPES.RESET:
      return INITIAL_STATE
    default:
      return state
  }
}

const counterSelectors = {
  value: state => state.counter,
  isComplete: state => state.counter === COUNTER_MAX
}

// then the reducer would be mounted to the store at `state.counter`:

const store = createStore(
  combineReducers({
    counter: counterReducer
  })
)

counterSelectors.value(store.getState()) // 0
counterSelectors.isComplete(store.getState()) // true

store.dispatch(counterActions.increment(10))
counterSelectors.value(store.getState()) // 10
counterSelectors.isComplete(store.getState()) // true

store.dispatch(counterActions.decrement(9))
counterSelectors.value(store.getState()) // 9
counterSelectors.isComplete(store.getState()) // false

store.dispatch(counterActions.reset())
counterSelectors.value(store.getState()) // 0
counterSelectors.isComplete(store.getState()) // false
```

Each section in this guide shows how each `redux-modular` helper function can be used to reduce code repetition and boilerplate.

### Defining actions

Using `createAction`, we can easily define `FSA-Compliant` action creator:

```js
import { createAction } from 'redux-modular'

const counterActions = {
  increment: createAction(COUNTER_TYPES.INCREMENT, (value = 1) => ({ value })),
  decrement: createAction(COUNTER_TYPES.DECREMENT, (value = 1) => ({ value })),
  reset: createAction(COUNTER_TYPES.RESET)
}
```

`createAction` also does some extra work for us. If you call `toString()` on any of these action creators, it will return the action's type. This allows us to remove our `COUNTER_TYPES` constant declaration:

```js
import { createAction } from 'redux-modular'

const counterActions = {
  increment: createAction('increment (counter)', (value = 1) => ({ value })),
  decrement: createAction('decrement (counter)', (value = 1) => ({ value })),
  reset: createAction('reset (counter)')
}

counterActions.increment.toString() // 'increment (counter)'
```

Next, we can remove the repetition of namespacing our actions with the `(counter)` suffix. The `mountAction` helper will modify an action creator's action type using a given namespace:

```js
import { createAction, mountAction } from 'redux-modular'

const namespace = 'counter'

const counterActions = {
  increment: mountAction(namespace, createAction('increment', (value = 1) => ({ value })))
  decrement: mountAction(namespace, createAction('decrement', (value = 1) => ({ value })),
  reset: mountAcgtion(createAction('reset')
}

counterActions.increment.toString() // 'increment (counter)'
```

Finally, we can use the `createActions` and `mountActions` helpers to reduce all of the above boilerplate:

```js
import { createActions, mountActions } from 'redux-modular'

const counterActions = mountActions('counter', createActions({
  increment: null,
  decrement: null,
  reset
}))
```

### Defining reducers

`createReducer` creates a reducer which switches based on action type, and passes the action `payload` directly to your sub-reducer function:

```js
import { createReducer } from 'redux-modular'

const INITIAL_STATE = 0
const COUNTER_MIN = 0
const COUNTER_MAX = 10

const counterReducer = createReducer(INITIAL_STATE, {
  [counterActions.increment]: (state, payload) => Math.min(state + payload.amount, COUNTER_MAX),
  [counterActions.decrement]: (state, payload) => Math.max(state + payload.amount, COUNTER_MIN),
  [counterActions.reset]: () => INITIAL_STATE
})
```

Note that, because we passed the action creators directly as the object keys, the `toString()` function will be called on them automatically.

### Defining selectors

`mountSelector` will wrap a selector with a selector which first selects the state at a provided path:

```js
const isCompleteSelector = mountSelector('counter', counterState => counterState === COUNTER_MAX)

isCompleteSelector({ counter: 5 }) // 5
```

`mountSelectors` allows you to mount multiple selectors at once:

```js
const counterSelectors = mountSelectors('counter', {
  value: counterState => counterState,
  isComplete: counterState => counterState === COUNTER_MAX
}
```

If our logic lives multiple levels deep in the redux state tree, you can use [lodash.get](https://lodash.com/docs/4.17.10#get) syntax to perform a deep select:

```js
const counterSelectors = mountSelectors('path.counter', {
  value: counterState => counterState,
  isComplete: counterState => counterState === COUNTER_MAX
}

counterSelectors.value({ nested: { counter: 5 } }) // 5
```

### Defining reusable redux logic

Putting the above examples together, we have reduced much boilerplate & repetition:

```js
import { createActions, mountActions, createReducer, mountSelectors } from 'redux-modular'

const INITIAL_STATE = 0
const COUNTER_MIN = 0
const COUNTER_MAX = 10

const counterActions = mountActions('counter', createActions({
  increment: null,
  decrement: null
}))

const counterReducer = createReducer(INITIAL_STATE, {
  [counterActions.increment]: (state, payload) => Math.min(state + payload.amount, COUNTER_MAX),
  [counterActions.decrement]: (state, payload) => Math.max(state + payload.amount, COUNTER_MIN),
  [counterActions.reset]: () => INITIAL_STATE
})

const counterSelector = mountSelectors('counter', {
  value: counterState => counterState,
  percentage: counterState => counterState === COUNTER_MAX
})
```

However, what if we wanted to reuse this logic in multiple places in the redux state tree? We can easily wrap these definitions in a factory function, with the path and counter max as parameters:

```js
// create-counter-logic.js
import { createActions, mountActions } from 'redux-modular'

const INITIAL_STATE = 0
const COUNTER_MIN = 0

export default function createCounterLogic (path, counterMax) {
  const counterActions = mountActions(path, createActions({
    increment: null,
    decrement: null
  }))

  const counterReducer = createReducer(INITIAL_STATE, {
    [counterActions.increment]: (state, payload) => Math.min(state + payload.amount, counterMax),
    [counterActions.decrement]: (state, payload) => Math.max(state + payload.amount, COUNTER_MIN),
    [counterActions.reset]: () => INITIAL_STATE
  })

  const counterSelector = mountSelectors('counter', {
    value: counterState => counterState,
    percentage: counterState => counterState === counterMax
  })

  return {
    counterActions,
    counterReducer,
    counterSelectors
  }
}
```

Now, we can quickly and easily instantiate our logic and mount it multiple places in our redux state tree:

```js
import { createStore,combineReducers } from 'redux'
import createCounterLogic from './create-counter-logic.js'

const counterTo5 = createCounterLogic('counterTo5', 0, 5)
const counterTo10 = createCounterLogic('counterTo10', 0, 10)

const store = createStore(
  combineReducers({
    counterTo5: counterTo5.reducer
    nested: {
      counterTo10: counterTo10.reducer
    }
  })
)

store.dispatch(counterTo5.actions.increment(5))
counterTo5.selectors.value(store.getState()) // 5
counterTo5.selectors.isComplete(store.getState()) // true

counterTo10.selectors.isComplete(store.getState()) // false
store.dispatch(counterTo5.actions.increment(10))
counterTo10.selectors.value(store.getState()) // 10
counterTo10.selectors.isComplete(store.getState()) // true
```

## API

`createAction(String type, [Function payloadCreator]) : ActionCreator`

`createActions(Object<String type, Function payloadCreator> payloadCreatorMap) : Object<String, ActionCreator>`

`mountAction(String|Array<String> path, ActionCreator actionCreator) : ActionCreator`

`mountActions(Object<String, ActionCreator> actionCreatorMap) : Object<String, ActionCreator>`

`createReducer(Any initialState, Object<String type, Function reducer>) : Function reducer`

`mountSelector(String|Array<String> path, Function selector) : Function selector`

`mountSelectors(String|Array<String> path, Object<String, Function selector> selectorMap) : Object<String, Function selector>`
