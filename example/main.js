import Vue from 'vue'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { Subject } from 'rxjs/Subject'
import VueRx from 'vue-rx'
import Store from '../dist/store'

import products from './store/products'
import cart from './store/cart'
import App from './App.vue'
console.log(Store)
Vue.use(VueRx, {
  Observable,
  Subscription,
  Subject
})
Vue.use(Store)

new Vue({
  el: '#app',
  template: '<App/>',
  store: Store.init({
	  store: { products, cart }
	}),
  components: { App }
})