export default function mapValues (object, map) {
  return Object.keys(object).reduce((prev, key) => {
    return Object.assign(prev, {
      [key]: map(object[key], key)
    })
  }, {})
}
