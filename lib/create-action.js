export default (type, payloadCreator = () => null, metaCreator = () => null) => {
  const context = { type }

  const actionCreator = function (...params) {
    return {
      type: this.type,
      payload: payloadCreator(...params),
      meta: metaCreator(...params)
    }
  }.bind(context)

  actionCreator.toString = function () {
    return this.type
  }.bind(context)

  actionCreator.setType = type => {
    context.type = type
  }

  return actionCreator
}
