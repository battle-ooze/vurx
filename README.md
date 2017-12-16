# vurx

一个 vue 的状态管理工具，基于 rx.js, vue-rx

### 安装


#### NPM

```bash
npm install vue vue-rx vurx --save
```

```js
import Vue from 'vue'
import Rx from 'rxjs/Rx'
import VueRx from 'vue-rx'
import Vurx from 'vurx'
Vue.use(VueRx, Rx)
Vue.use(Vurx)
```

### 用法

#### 定义一个 Store

```Js
import { store, observable, action, getter } from 'vurx'
import Rx from 'rxjs'

@store
export default class MyStore {
  // 定义一个 observable
  @observable foo = new Rx.BehaviorSubject('hello world')
  
  // 定义一个 getter
  @getter 
  get bar () {
    return this.foo.map(str => str + '!') 
  }
  
  // 定义一个 action
  @action
  setFoo (value) {
    this.foo.next(value)
  }
  
  // 加载完成钩子
  mounted () {
    // do something
  }
}
```

#### 初始化

```Javascript
var store = Vurx.init({
  store: { MyStore }
})
```

然后就可以通过 `store` 获取状态和调用 `action`

```Javascript
store.MyStore.foo.subscribe(foo => {console.log(foo)})
store.MyStore.bar.subscribe(bar => {console.log(bar)})
store.MyStore.setFoo('abc')

// output:
// hello world
// hello world!
// abc
// abc! 
```

### 在 Vue 中使用

将 store 注入 Vue 实例

```Javascript
var store = Vurx.init({
  store: { MyStore }
})

new Vue({
  el: '#app',
  template: '<App/>',
  store,
  components: { App }
})
```

在组件中可以通过 `this.$store` 获取 `store`

```Js
this.$store.MyStore.foo.subscribe(foo => {console.log(foo)})
this.$store.MyStore.bar.subscribe(bar => {console.log(bar)})
this.$store.MyStore.setFoo('abc')

// output:
// hello world
// hello world!
// abc
// abc!
```

通过 `vue-rx` 将状态映射到本地组件里

```Js
var vm = new Vue({
  subscriptions () {
    return {
      myFoo: this.$store.MyStore.foo
    }
  },
  mounted () {
    console.log(this.myFoo) // 'hello world'
    console.log(this.myBar) // 'hello world!'
  }
})
```

使用 `mapObservables` 和 `mapActions`，方便进行多个 `observable` 和 `action` 的映射 

```Js
var vm = new Vue({
  subscriptions () {
    return {
      ...mapObservables(this, 'MyStore', ['foo', 'bar'])
    }
  },
  methods: {
    ...mapActions('MyStore', ['setFoo'])
  },
  mounted () {
    console.log(this.foo) // 'hello world'
    console.log(this.bar) // 'hello world!'
    this.setFoo('abc')
  }
})
```

如果项目使用了 `vue-class-components`，可以使用 `Observable` 和 `Action` 装饰器

```Js
import Vue from 'vue'
import { Observable, Action } from 'vurx/lib/class'
import Component from 'vue-class-component'

@Component
export default class MyComponent extends Vue {
  @Observable('MyStore') foo
  @Observable('MyStore') bar
  
  @Action('MyStore')
  setFoo () {}
}
```

### API 

#### `mapObservables(ctx, module, observables)`
* `ctx` 当前实例的 `this`
* `module` 模块名
* `observables` 需要映射的 `observable` 和 `getter`

#### `mapActions(module, actions)`
* `module` 模块名
* `actions` 需要映射的 `action`

#### `Observable(module, name, mapFn)`
* `module` 模块名
* `name` 映射的本地属性名
* `mapFn` 自定义 `getter`，参数是 `observable`

#### `Action(module, name)`
* `module` 模块名
* `name` 映射的本地属性名

