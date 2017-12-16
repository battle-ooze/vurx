# vurx

一个 vue 的状态管理工具，基于 rx.js, vue-rx

### 安装


#### NPM

``` bash
npm install vue vue-rx vurx --save
```

```js
import Vue from 'vue'
import Rx from 'rxjs/Rx'
import VueRx from 'vue-rx'
Vue.use(VueRx, Rx)
Vue.use(Store)
```