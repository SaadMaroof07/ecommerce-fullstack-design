<template>
  <div class="detail-page">
    <div class="container">

      <!-- Loading -->
      <div class="loading-state" v-if="loading">
        <div class="skeleton-main">
          <div class="skeleton-image"></div>
          <div class="skeleton-info">
            <div class="skeleton-line long"></div>
            <div class="skeleton-line medium"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div class="error-state" v-else-if="error">
        <p>⚠️ Product not found.</p>
        <NuxtLink to="/products" class="btn-back">← Back to Products</NuxtLink>
      </div>

      <!-- Product Content -->
      <div v-else-if="product">

        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <NuxtLink to="/">Home</NuxtLink>
          <span>›</span>
          <NuxtLink to="/products">Products</NuxtLink>
          <span>›</span>
          <span class="current">{{ product.name }}</span>
        </div>

        <!-- Main Product Section -->
        <div class="product-main">

          <!-- Left: Images -->
          <div class="product-images">
            <div class="main-image">
              <img :src="selectedImage || product.image" :alt="product.name" />
            </div>
            <div class="image-thumbnails" v-if="product.images && product.images.length > 1">
              <img
                v-for="(img, index) in product.images"
                :key="index"
                :src="img"
                :class="{ active: selectedImage === img }"
                @click="selectedImage = img"
              />
            </div>
          </div>

          <!-- Right: Info -->
          <div class="product-details">
            <p class="product-category">{{ product.category }}</p>
            <h1 class="product-title">{{ product.name }}</h1>

            <!-- Stock Badge -->
            <div class="stock-badge" :class="product.in_stock ? 'in-stock' : 'out-stock'">
              {{ product.in_stock ? '✓ In Stock (' + product.stock + ' units)' : '✕ Out of Stock' }}
            </div>

            <!-- Price -->
            <div class="price-row">
              <span class="current-price">${{ product.price }}</span>
            </div>

            <!-- Description -->
            <p class="description">{{ product.description }}</p>

            <!-- Quantity -->
            <div class="quantity-row" v-if="product.in_stock">
              <label class="qty-label">Quantity:</label>
              <div class="qty-control">
                <button @click="quantity > 1 ? quantity-- : null">−</button>
                <span>{{ quantity }}</span>
                <button @click="quantity < product.stock ? quantity++ : null">+</button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button
                class="btn-cart"
                @click="addToCart"
                :disabled="!product.in_stock"
              >
                🛒 Add to Cart
              </button>
              <button
                class="btn-buy"
                :disabled="!product.in_stock"
              >
                ⚡ Buy Now
              </button>
            </div>

            <!-- Meta Info -->
            <div class="meta-info">
              <div class="meta-item">
                <span class="meta-label">Category:</span>
                <span>{{ product.category }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Free Delivery:</span>
                <span>On orders over $50</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs-section">
          <div class="tabs-header">
            <button
              v-for="tab in tabs"
              :key="tab"
              class="tab-btn"
              :class="{ active: activeTab === tab }"
              @click="activeTab = tab"
            >
              {{ tab }}
            </button>
          </div>
          <div class="tab-content">
            <div v-if="activeTab === 'Description'">
              <p>{{ product.description }}</p>
            </div>
            <div v-if="activeTab === 'Reviews'">
              <p>⭐⭐⭐⭐⭐ — "Excellent product!" — Ali K.</p>
              <p>⭐⭐⭐⭐ — "Good quality, fast delivery." — Sara M.</p>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div class="related-section" v-if="relatedProducts.length > 0">
          <h2 class="section-title">Related Products</h2>
          <div class="related-grid">
            <div
              class="related-card"
              v-for="related in relatedProducts"
              :key="related.id"
              @click="$router.push('/product/' + related.id)"
            >
              <div class="related-image">
                <img :src="related.image" :alt="related.name" />
              </div>
              <div class="related-info">
                <p class="related-name">{{ related.name }}</p>
                <p class="related-price">${{ related.price }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Product Detail - Ecommerce Store' })

const { get } = useApi()
const cartStore = useCartStore()
const route = useRoute()

// ===== STATE =====
const product = ref(null)
const relatedProducts = ref([])
const loading = ref(true)
const error = ref(null)
const selectedImage = ref('')
const quantity = ref(1)
const activeTab = ref('Description')
const tabs = ['Description', 'Specifications', 'Reviews']

// ===== FETCH PRODUCT =====
onMounted(async () => {
  const productId = route.params.id

  // Current product fetch karo
  const { data, error: err } = await get(`/products/${productId}/`)
  if (err) {
    error.value = err
    loading.value = false
    return
  }

  product.value = data
  // Image set karo — agar array hai to pehli, warna single URL
  selectedImage.value = Array.isArray(data.images) ? data.images[0] : data.image

  // Related products fetch karo (same category)
  const { data: relatedData } = await get(`/products/?category=${data.category}&page_size=4`)
  if (relatedData) {
    // Current product ko related mein se hatao
    relatedProducts.value = relatedData.results.filter(p => p.id !== data.id)
  }

  loading.value = false
})

// ===== METHODS =====
const addToCart = () => {
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.image,
    category: product.value.category,
    quantity: quantity.value
  })
}
</script>

<style scoped>
.detail-page {
  padding: 30px 0 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 30px;
}

.breadcrumb a {
  color: #64748b;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #2563eb;
}

.breadcrumb .current {
  color: #1e293b;
  font-weight: 500;
}

/* Main Layout */
.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-bottom: 50px;
}

/* Images */
.main-image {
  background: #f8fafc;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 380px;
  margin-bottom: 12px;
}

.main-image img {
  max-height: 320px;
  max-width: 100%;
  object-fit: contain;
}

.image-thumbnails {
  display: flex;
  gap: 10px;
}

.image-thumbnails img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  padding: 6px;
  cursor: pointer;
  background: #f8fafc;
  transition: border-color 0.2s;
}

.image-thumbnails img.active,
.image-thumbnails img:hover {
  border-color: #2563eb;
}

/* Product Details */
.product-category {
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.product-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
  line-height: 1.3;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.reviews {
  font-size: 13px;
  color: #94a3b8;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.current-price {
  font-size: 32px;
  font-weight: 800;
  color: #2563eb;
}

.old-price {
  font-size: 18px;
  color: #94a3b8;
  text-decoration: line-through;
}

.discount {
  background: #dcfce7;
  color: #16a34a;
  font-size: 13px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}

.description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 24px;
}

/* Quantity */
.quantity-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.qty-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.qty-control {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.qty-control button {
  width: 36px;
  height: 36px;
  border: none;
  background: #f8fafc;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s;
}

.qty-control button:hover {
  background: #e2e8f0;
}

.qty-control span {
  width: 48px;
  text-align: center;
  font-weight: 600;
  font-size: 15px;
}

/* Buttons */
.action-buttons {
  display: flex;
  gap: 14px;
  margin-bottom: 28px;
}

.btn-cart {
  flex: 1;
  padding: 14px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cart:hover {
  background: #1d4ed8;
}

.btn-buy {
  flex: 1;
  padding: 14px;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-buy:hover {
  background: #d97706;
}

/* Meta */
.meta-info {
  border-top: 1px solid #f1f5f9;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.meta-item {
  display: flex;
  gap: 10px;
  font-size: 14px;
}

.meta-label {
  font-weight: 600;
  color: #374151;
  min-width: 120px;
}

.in-stock {
  color: #16a34a;
  font-weight: 500;
}

/* Tabs */
.tabs-section {
  margin-bottom: 50px;
}

.tabs-header {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 24px;
}

.tab-btn {
  padding: 12px 24px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.tab-content {
  font-size: 14px;
  color: #475569;
  line-height: 1.8;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table tr {
  border-bottom: 1px solid #f1f5f9;
}

.specs-table td {
  padding: 10px 16px;
  font-size: 14px;
}

.spec-label {
  font-weight: 600;
  color: #374151;
  width: 200px;
  background: #f8fafc;
}

/* Related */
.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.related-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: transform 0.2s;
}

.related-card:hover {
  transform: translateY(-4px);
}

.related-image {
  background: #f8fafc;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.related-image img {
  max-height: 110px;
  max-width: 100%;
  object-fit: contain;
}

.related-info {
  padding: 12px;
}

.related-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.related-price {
  font-size: 14px;
  font-weight: 700;
  color: #2563eb;
}

/* Responsive */
@media (max-width: 768px) {
  .product-main {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-buttons {
    flex-direction: column;
  }

  .loading-state { padding: 40px 0; }

.skeleton-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
}

.skeleton-image {
  height: 380px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 16px;
}

.skeleton-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 20px;
}

.skeleton-line {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line.long   { width: 100%; }
.skeleton-line.medium { width: 60%; }
.skeleton-line.short  { width: 30%; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.stock-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
}

.in-stock  { background: #dcfce7; color: #16a34a; }
.out-stock { background: #fee2e2; color: #ef4444; }

.btn-cart:disabled,
.btn-buy:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-state {
  text-align: center;
  padding: 80px 0;
  color: #64748b;
}

.btn-back {
  display: inline-block;
  margin-top: 16px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}
}
</style>