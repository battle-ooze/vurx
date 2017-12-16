import Component, { createDecorator } from 'vue-class-component'

Component.registerHooks([
  'subscriptions'
])

const Observable = function (module, name, mapFn) {
  return createDecorator((options, key) => {
    if (typeof name === 'function') {
      mapFn = name
      name = key
    }
    const { subscriptions = () => { } } = options
    options.subscriptions = function () {
      return {
        [key]: (mapFn && mapFn.call(this, this.$store[module][name || key])) || this.$store[module][name || key],
        ...subscriptions.bind(this)()
      }
    }
  })
}

const Action = function (module, name) {
  return createDecorator((options, key) => {
    if (!options.methods) {
      options.methods = {}
    }
    options.methods[key] = function mappedAction (...args) {
      return this.$store[module][name || key].apply(this.$store[module], args)
    }
  })
}

export { Observable, Action }