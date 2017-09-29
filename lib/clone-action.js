export default actionCreator => {
  const context = { type: actionCreator.toString() }

  const clone = function () {
    return actionCreator.apply(context, arguments)
  }

  Object.assign(clone, actionCreator, {
    setType: type => {
      context.type = type
    },
    toString: function () { return this.type }.bind(context)
  })

  return clone
}
