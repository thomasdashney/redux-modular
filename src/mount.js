import get from 'lodash.get'
import warning from 'warning'
import createActions from './create-actions'
import mountActions from './mount-actions'

export default function mount (pathToState, logic) {
  warning(true, 'redux-modular mount() is deprecated')
  validateArgs(...arguments)
  return mountLogic(pathToState, logic)
}

function validateArgs (pathToState, logic) {
  if (!logic) {
    throw new Error('logic must be passed to mount')
  }
}

function mountLogic (pathToState, logic) {
  const result = {}

  if (logic.actions) {
    result.actions = createAndMountActions(pathToState, logic.actions)
  }

  if (logic.actions && logic.reducer) {
    result.reducer = logic.reducer(result.actions)
  }

  if (logic.selectors) {
    result.selectors = createSelectors(pathToState, logic.selectors)
  }

  return result
}

function createAndMountActions (pathToState, actions) {
  return mountActions(pathToState, createActions(actions))
}

function createSelectors (pathToState, selectors) {
  const localStateSelector = pathToState
      ? state => get(state, pathToState)
      : state => state

  return selectors(localStateSelector)
}
