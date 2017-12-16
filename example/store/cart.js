import { store, observable, action, getter } from '../../dist/store'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import 'rxjs/add/operator/map'

@store
export default class Cart {
	@observable cart = new BehaviorSubject([])

	products = []

	@getter
	get total () {
    return this.cart.map(cart => {
      let total = 0
      cart.forEach(item => {
        total += +item.count * +item.price
      })
      return total.toFixed(2)
    })
  }

  mounted () {
  	this.$store.products.products.subscribe(value => {
  		this.products = value
  	})
  }

	@action
	add (id) {
		let cart = this.cart.getValue()
		let item = cart.find(item => item.id === id)
		if (item) {
			item.count++
		} else {
			let product = this.products.find(item => item.id === id)
			cart.push({
				id: product.id,
				name: product.name,
				price: product.price,
				count: 1
			})
		}
		this.cart.next(cart)
	}
}