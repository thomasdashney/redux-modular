import { isString, isArray } from '../utils'

export default function createType (pathToState) {
  validateArgument(pathToState)

  if (isArray(pathToState)) {
    pathToState = pathToState.join('.')
  }

  return type => `${type} (${pathToState})`
}

const validArgumentTests = [
  isString,
  pathToState => isArray(pathToState) && pathToState.every(isString)
]

function validateArgument (pathToState) {
  if (validArgumentTests.every(test => !test(pathToState))) {
    throw new InvalidArgError()
  }
}

class InvalidArgError extends Error {
  constructor () {
    super('path must be a string or array of strings')
  }
}
