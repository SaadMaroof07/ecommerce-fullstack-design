<template>
  <div class="cart-page">
    <div class="container">

      <h1 class="page-title">My Cart</h1>

      <!-- Empty Cart -->
      <div class="empty-cart" v-if="cartStore.cartItems.length === 0">
        <p class="empty-icon">🛒</p>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started</p>
        <a href="/products" class="btn-shop">Browse Products</a>
      </div>

      <!-- Cart Content -->
      <div class="cart-layout" v-else>

        <!-- Left: Cart Items -->
        <div class="cart-items">

          <!-- Header -->
          <div class="cart-header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span></span>
          </div>

          <!-- Item Row -->
          <div
            class="cart-item"
            v-for="item in cartStore.cartItems"
            :key="item.id"
          >
            <!-- Product Info -->
            <div class="item-product">
              <img :src="item.image" :alt="item.name" class="item-image" />
              <div class="item-details">
                <p class="item-name">{{ item.name }}</p>
                <p class="item-category">{{ item.category }}</p>
              </div>
            </div>

            <!-- Price -->
            <div class="item-price">${{ item.price }}</div>

            <!-- Quantity Control -->
            <div class="item-qty">
              <div class="qty-control">
                <button @click="decreaseQty(item)">−</button>
                <span>{{ item.quantity }}</span>
                <button @click="item.quantity++">+</button>
              </div>
            </div>

            <!-- Total -->
            <div class="item-total">
              ${{ (item.price * item.quantity).toFixed(2) }}
            </div>

            <!-- Remove -->
            <button class="remove-btn" @click="removeItem(item.id)">✕</button>

          </div>

          <!-- Cart Actions -->
          <div class="cart-actions">
            <a href="/products" class="btn-continue">← Continue Shopping</a>
            <button class="btn-clear" @click="clearCart">Clear Cart</button>
          </div>

        </div>

        <!-- Right: Order Summary -->
        <div class="order-summary">

          <h2 class="summary-title">Order Summary</h2>

          <div class="summary-row">
            <span>Subtotal ({{ totalItems }} items)</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>

          <div class="summary-row">
            <span>Shipping</span>
            <span :class="shipping === 0 ? 'free-shipping' : ''">
              {{ shipping === 0 ? 'FREE' : '$' + shipping }}
            </span>
          </div>

          <div class="summary-row">
            <span>Tax (10%)</span>
            <span>${{ tax.toFixed(2) }}</span>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-total">
            <span>Total</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>

          <!-- Coupon -->
          <div class="coupon-section">
            <input
              type="text"
              v-model="couponCode"
              placeholder="Enter coupon code"
              class="coupon-input"
            />
            <button class="coupon-btn" @click="applyCoupon">Apply</button>
          </div>
          <p class="coupon-msg" v-if="couponMsg" :class="couponSuccess ? 'success' : 'error'">
            {{ couponMsg }}
          </p>

          <button class="btn-checkout">
            Proceed to Checkout →
          </button>

          <!-- Accepted Payments -->
          <div class="payment-icons">
            <span>💳</span>
            <span>🏦</span>
            <span>📱</span>
          </div>
          <p class="secure-text">🔒 Secure & Encrypted Payment</p>

        </div>
      </div>

      <!-- Recommended Products -->
      <div class="recommended-section">
        <h2 class="section-title">You May Also Like</h2>
        <div class="recommended-grid">
          <div
            class="rec-card"
            v-for="product in recommendedProducts"
            :key="product.id"
            @click="$router.push('/product/' + product.id)"
          >
            <div class="rec-image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="rec-info">
              <p class="rec-name">{{ product.name }}</p>
              <p class="rec-price">${{ product.price }}</p>
              <button class="rec-add" @click.stop="addToCart(product)">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'

useHead({ title: 'Cart - Ecommerce Store' })

const cartStore = useCartStore()

// Recommended Products
const recommendedProducts = [
  { id: 2,  name: 'MacBook Pro',    price: 1299, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300' },
  { id: 4,  name: 'Canon Camera',   price: 849,  image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300' },
  { id: 7,  name: 'Nike Air Max',   price: 129,  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300' },
  { id: 9,  name: 'Apple Watch SE', price: 249,  image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300' },
]

// Coupon
const couponCode = ref('')
const couponMsg = ref('')
const couponSuccess = ref(false)
const discount = ref(0)

// Computed
const totalItems = computed(() => cartStore.totalItems)
const subtotal = computed(() => cartStore.subtotal)
const shipping = computed(() => subtotal.value >= 50 ? 0 : 10)
const tax = computed(() => subtotal.value * 0.1)
const total = computed(() => subtotal.value + shipping.value + tax.value - discount.value)

// Methods
const decreaseQty = (item) => cartStore.decreaseQty(item.id)
const removeItem = (id) => cartStore.removeItem(id)
const clearCart = () => cartStore.clearCart()
const addToCart = (product) => cartStore.addToCart(product)

const applyCoupon = () => {
  if (couponCode.value === 'SAVE10') {
    discount.value = subtotal.value * 0.1
    couponMsg.value = '✓ Coupon applied! 10% discount'
    couponSuccess.value = true
  } else {
    couponMsg.value = '✕ Invalid coupon code'
    couponSuccess.value = false
    discount.value = 0
  }
}
</script>

<style scoped>
.cart-page {
  padding: 40px 0 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 30px;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 80px 0;
  color: #64748b;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-cart h2 {
  font-size: 24px;
  color: #1e293b;
  margin-bottom: 8px;
}

.btn-shop {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 30px;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

/* Layout */
.cart-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 30px;
  align-items: start;
}

/* Cart Header */
.cart-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 40px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

/* Cart Item */
.cart-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 40px;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 12px;
}

.item-product {
  display: flex;
  align-items: center;
  gap: 14px;
}

.item-image {
  width: 70px;
  height: 70px;
  object-fit: contain;
  background: #f8fafc;
  border-radius: 8px;
  padding: 6px;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.item-category {
  font-size: 12px;
  color: #94a3b8;
}

.item-price,
.item-total {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.item-total {
  color: #2563eb;
}

/* Qty Control */
.qty-control {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
}

.qty-control button {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8fafc;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.qty-control button:hover {
  background: #e2e8f0;
}

.qty-control span {
  width: 40px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
}

.remove-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: #fee2e2;
  color: #ef4444;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #fecaca;
}

/* Cart Actions */
.cart-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.btn-continue {
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.btn-clear {
  padding: 8px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* Order Summary */
.order-summary {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  position: sticky;
  top: 80px;
}

.summary-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f1f5f9;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;
}

.free-shipping {
  color: #16a34a;
  font-weight: 600;
}

.summary-divider {
  border-top: 1px solid #f1f5f9;
  margin: 16px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
}

/* Coupon */
.coupon-section {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.coupon-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
}

.coupon-input:focus {
  border-color: #2563eb;
}

.coupon-btn {
  padding: 10px 16px;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.coupon-msg {
  font-size: 13px;
  margin-bottom: 16px;
}

.coupon-msg.success { color: #16a34a; }
.coupon-msg.error   { color: #ef4444; }

.btn-checkout {
  width: 100%;
  padding: 14px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 16px;
}

.btn-checkout:hover {
  background: #1d4ed8;
}

.payment-icons {
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 24px;
  margin-bottom: 8px;
}

.secure-text {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
}

/* Recommended */
.recommended-section {
  margin-top: 60px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
}

.recommended-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.rec-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: transform 0.2s;
}

.rec-card:hover {
  transform: translateY(-4px);
}

.rec-image {
  background: #f8fafc;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.rec-image img {
  max-height: 110px;
  max-width: 100%;
  object-fit: contain;
}

.rec-info {
  padding: 14px;
}

.rec-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}

.rec-price {
  font-size: 15px;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 10px;
}

.rec-add {
  width: 100%;
  padding: 8px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.rec-add:hover {
  background: #1d4ed8;
}

/* Responsive */
@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-header {
    display: none;
  }

  .cart-item {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .recommended-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>