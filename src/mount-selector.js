import get from 'lodash.get'

export default function mountSelector (path, selector) {
  if (!path) return selector

  return state => {
    const nestedState = get(state, path)

    if (nestedState === undefined) {
      throw new Error(`nested state ${path} does not exist`)
    }

    return selector(nestedState)
  }
}
