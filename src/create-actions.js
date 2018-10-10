import createAction from './create-action'
import mapValues from './util/map-values'

export default function createActions (payloadCreators) {
  return mapValues(payloadCreators, (payloadCreator, key) => {
    return createAction(key, payloadCreator)
  })
}
