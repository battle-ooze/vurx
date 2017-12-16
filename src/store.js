/**
 * 状态管理模块
 * 提供 store / observable / getter / action 修饰器来书写状态模块
 * 提供 Observable / Action 修饰器用来在 vue 组件中引入
 * 也可以用 mapObservables / mapActions 在非 class 的 vue 组件中引入
 * 提供插件用于将 store 注入到 Vue 组件的 this.$store 中
 *
 * 依赖： Rxjs vue-rx vue-class-component
 */
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import 'rxjs/add/operator/do'

function action (target, key, descriptor) {
  if (!target._action) target._action = []
  target._action.push(key)
  return descriptor
}

function observable (target, key, descriptor) {
  if (!target._observable) target._observable = []
  target._observable.push(key)
  return descriptor
}

function getter (target, key, descriptor) {
  if (!target._getter) target._getter = []
  target._getter.push(key)
  let getter = descriptor.get
  descriptor.get = function () {
    let val = new BehaviorSubject(null)
    getter.apply(this, ...arguments).subscribe(val)
    return val
  }
  return descriptor
}

function store (target) {
  target.prototype.getInstance = function () {
    let newStore = {}
    this._action && this._action.forEach(key => {
      newStore[key] = this[key].bind(this)
    })

    this._observable && this._observable.forEach(key => {
      this[key].do(res => {
        // do something
      }).subscribe()
      newStore[key] = this[key].asObservable ? this[key].asObservable() : this[key]
    })

    this._getter && this._getter.forEach(key => {
      newStore[key] = this[key]
    })
    return newStore
  }
}

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}

function mapActions (module, actions) {
  const res = {}
  normalizeMap(actions).forEach(({key, val}) => {
    res[key] = function mappedAction (...args) {
      if (!this.$store[module] || !this.$store[module][val]) {
        return
      }
      return this.$store[module][val].apply(this.$store[module], args)
    }
  })
  return res
}

function mapObservables (ctx, module, observable) {
  const res = {}
  normalizeMap(observable).forEach(({key, val}) => {
    val = ctx.$store[module] && ctx.$store[module][val]
    res[key] = typeof val === 'function' ? val.call(ctx.$store[module]) : val
  })
  return res
}

function install (Vue) {
  Vue.mixin({
    beforeCreate () {
      const options = this.$options
      // store injection
      if (options.store) {
        this.$store = typeof options.store === 'function' ? options.store() : options.store
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store
      }
    }
  })
}

function init (options) {
  let rootStore = {}
  let store = options.store
  for (let key in store) {
    rootStore[key] = new store[key]()
  }
  for (let key in rootStore) {
    rootStore[key].$store = rootStore
    rootStore[key].mounted && rootStore[key].mounted()
    rootStore[key] = rootStore[key].getInstance()
  }
  return rootStore
}

export { store, observable, action, getter, mapActions, mapObservables }
export default { install, init }
