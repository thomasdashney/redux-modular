import get from 'lodash.get'
import globalizeActions from './globalize-actions'

export default (params) => {
  if (!params) {
    throw new Error('An object must be passed to modularize()')
  }

  return pathToState => {
    let { actions, reducer, selectors } = params

    if (actions) {
      actions = globalizeActions(pathToState, actions)
    }

    if (actions && reducer) {
      reducer = reducer(actions)
    }

    if (selectors) {
      selectors = selectors(state => get(state, pathToState))
    }

    return {
      actions,
      reducer,
      selectors
    }
  }
}
