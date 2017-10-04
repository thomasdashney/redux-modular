import get from 'lodash.get'
import globalizeActions from './globalize-actions'

export default (pathToState, logic) => {
  if (!logic) {
    throw new Error('logic must be passed to mount')
  }

  let { actions, reducer, selectors } = logic

  if (actions) {
    actions = globalizeActions(pathToState, actions)
  }

  if (actions && reducer) {
    reducer = reducer(actions)
  }

  if (selectors) {
    const localStateSelector = pathToState
      ? state => get(state, pathToState)
      : state => state

    selectors = selectors(localStateSelector)
  }

  return {
    actions,
    reducer,
    selectors
  }
}
