import get from 'lodash.get'
import globalizeActions from './globalize-actions'

export default (pathToState, logic) => {
  if (!pathToState || !logic) {
    throw new Error('pathToState and logic must be passed to mount')
  }

  let { actions, reducer, selectors } = logic

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
