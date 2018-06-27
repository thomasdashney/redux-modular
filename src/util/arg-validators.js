import { isArray, isString } from './type-utils'

export const validatePath = path => {
  return isString(path) || (isArray(path) && path.every(isString))
}
