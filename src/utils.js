export function isArray (value) {
  return typeof value === 'object' &&
         value !== null &&
         value.constructor === Array
}

export function isString (value) {
  return typeof value === 'string'
}

export function isObject (value) {
  return typeof value === 'object' && !isArray(value) && value !== null
}
