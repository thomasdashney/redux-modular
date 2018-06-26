import createActions from './action-helpers/create-actions'
import createSelectors from './selector-helpers/create-selectors'

export default function (logic, pathToState) {
  if (!logic) {
    throw new Error('logic must be passed to create-logic')
  }

  let { actions, reducer, selectors } = logic

  if (actions) {
    actions = createActions(actions, pathToState)
  }

  if (actions && reducer) {
    reducer = reducer(actions)
  }

  if (selectors) {
    selectors = createSelectors(selectors, pathToState)
  }

  return {
    actions,
    reducer,
    selectors
  }
}
