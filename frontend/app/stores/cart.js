import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },
    subtotal: (state) => {
      return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    cartItems: (state) => state.items
  },

  actions: {
    // Cart localStorage se restore karo
    restoreCart() {
      if (process.client) {
        const saved = localStorage.getItem('cart_items')
        if (saved) {
          this.items = JSON.parse(saved)
        }
      }
    },

    // Cart save karo localStorage mein
    saveCart() {
      if (process.client) {
        localStorage.setItem('cart_items', JSON.stringify(this.items))
      }
    },

    addToCart(product) {
      const existing = this.items.find(item => item.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: 1
        })
      }
      this.saveCart()
    },

    decreaseQty(productId) {
      const item = this.items.find(item => item.id === productId)
      if (item && item.quantity > 1) {
        item.quantity--
      } else {
        this.removeItem(productId)
      }
      this.saveCart()
    },

    removeItem(productId) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index !== -1) {
        this.items.splice(index, 1)
      }
      this.saveCart()
    },

    clearCart() {
      this.items = []
      this.saveCart()
    }
  }
})