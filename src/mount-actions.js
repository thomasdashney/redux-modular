import mountAction from './mount-action'
import mapValues from './util/map-values'

export default function mountActions (path, actions) {
  return mapValues(actions, action => mountAction(path, action))
}
