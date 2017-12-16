import { store, observable, action } from '../../dist/store'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
const list = [
  {id: 1, name: 'Mario Kart 8 Deluxe', price: 430.10, inventory: 10},
  {id: 2, name: 'The Legend of Zelda: Breath of the Wild', price: 500.01, inventory: 10},
  {id: 3, name: 'ARMS', price: 19.99, inventory: 20},
  {id: 4, name: 'Puyo Puyo Tetris', price: 19.99, inventory: 20}
]

@store
export default class User {
	@observable products = new BehaviorSubject([])

	@action
	getProducts () {
		setTimeout(() => {
		  this.products.next([...list])
		}, 500)
	}

	@action
	addToCart (id) {
		let products = this.products.getValue()
		let item = products.find(item => item.id === id)
		if (item.inventory > 0) {
			item.inventory--
			this.$store.cart.add(id)
		}
	}
}