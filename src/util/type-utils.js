export const isArray = value => {
  return typeof value === 'object' &&
         value !== null &&
         value.constructor === Array
}

export const isString = value => typeof value === 'string'
