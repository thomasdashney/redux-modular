import { isString, isArray } from '../utils'

export default function createType (pathToState) {
  if (!pathToState) {
    throw new InvalidArgError()
  } else if (isArray(pathToState)) {
    if (!pathToState.every(isString)) {
      throw new InvalidArgError()
    }

    pathToState = pathToState.join('.')
  } else if (pathToState !== null && !isString(pathToState)) {
    throw new InvalidArgError()
  }

  return type => `${type} (${pathToState})`
}

class InvalidArgError extends Error {
  constructor () {
    super('path must be a string or array of strings')
  }
}
