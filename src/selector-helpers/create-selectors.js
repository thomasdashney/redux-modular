import get from 'lodash.get'

// TODO see if this is necessary

export default function createSelectors (selectors, pathToState) {
  return Object.keys(selectors).reduce((prev, key) => {
    const selector = selectors[key]
    return Object.assign(prev, {
      [key]: pathToState
        ? globalizeSelector(selector, pathToState)
        : selector
    })
  }, {})
}

function globalizeSelector (selector, pathToState) {
  return state => selector(get(state, pathToState))
}
