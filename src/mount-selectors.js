import mountSelector from './mount-selector'
import mapValues from './util/map-values'

export default function mountSelectors (path, selectors) {
  return mapValues(selectors, (selector) => mountSelector(path, selector))
}
