import get from 'lodash.get'
import globalActions from './global-actions'

export default (params = {}) => pathToState => {
  let { actions, reducer, selectors } = params

  if (actions) {
    actions = globalActions(pathToState, actions)
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
