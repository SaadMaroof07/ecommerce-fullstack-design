<template>
  <div class="products-page">
    <div class="container">
      <div class="page-layout">

        <!-- ===== LEFT SIDEBAR (FILTERS) ===== -->
        <aside class="sidebar">
          
          <h3 class="sidebar-title">Filters</h3>

          <!-- Category Filter -->
          <div class="filter-group">
            <h4 class="filter-heading">Category</h4>
            <ul class="filter-list">
              <li 
                v-for="cat in categories" 
                :key="cat"
                class="filter-item"
                :class="{ active: selectedCategory === cat }"
                @click="selectedCategory = cat"
              >
                {{ cat }}
              </li>
            </ul>
          </div>

          <!-- Price Filter -->
          <div class="filter-group">
            <h4 class="filter-heading">Price Range</h4>
            <div class="price-inputs">
              <input 
                type="number" 
                v-model="minPrice"
                placeholder="Min" 
                class="price-input"
              />
              <span>—</span>
              <input 
                type="number"
                v-model="maxPrice" 
                placeholder="Max" 
                class="price-input"
              />
            </div>
          </div>

          <!-- Rating Filter -->
          <div class="filter-group">
            <h4 class="filter-heading">Rating</h4>
            <ul class="filter-list">
              <li 
                v-for="star in [4, 3, 2, 1]" 
                :key="star"
                class="filter-item"
                :class="{ active: selectedRating === star }"
                @click="selectedRating = star"
              >
                {{ '⭐'.repeat(star) }} & above
              </li>
            </ul>
          </div>

          <!-- Clear Filters -->
          <button class="clear-btn" @click="clearFilters">
            Clear All Filters
          </button>

        </aside>

        <!-- ===== RIGHT SIDE (PRODUCTS) ===== -->
        <div class="products-section">

          <!-- Top Bar -->
          <div class="products-topbar">
            <p class="results-count">
              Showing <strong>{{ filteredProducts.length }}</strong> products
            </p>
            <div class="topbar-right">
              <select v-model="sortBy" class="sort-select">
                <option value="default">Sort by: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
              <!-- Grid/List Toggle -->
              <button 
                class="view-btn" 
                :class="{ active: viewMode === 'grid' }"
                @click="viewMode = 'grid'"
              >⊞</button>
              <button 
                class="view-btn"
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
              >☰</button>
            </div>
          </div>
          <!-- Loading -->
<div class="loading-grid" v-if="loading">
  <div class="skeleton-card" v-for="n in 6" :key="n"></div>
</div>

<!-- Error -->
<div class="no-products" v-else-if="error">
  <p>⚠️ Could not load products. Please try again.</p>
</div>

          <!-- Products Grid -->
          <div :class="viewMode === 'grid' ? 'products-grid' : 'products-list'" v-else>
            <div 
              class="product-card"
              v-for="product in filteredProducts"
              :key="product.id"
              @click="$router.push('/product/' + product.id)"
            >
              <div class="product-image">
                <img :src="product.image" :alt="product.name" />
                <span class="product-badge" v-if="product.badge">{{ product.badge }}</span>
              </div>
              <div class="product-info">
                <p class="product-category">{{ product.category }}</p>
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="product-rating">
                  {{ '⭐'.repeat(product.rating) }}
                  <span class="rating-count">({{ product.reviews }})</span>
                </div>
                <div class="product-bottom">
                  <div class="price-group">
                    <span class="product-price">${{ product.price }}</span>
                    <span class="old-price" v-if="product.oldPrice">${{ product.oldPrice }}</span>
                  </div>
                  <button class="add-to-cart" @click.stop="addToCart(product)">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No Products Found -->
          <div class="no-products" v-if="filteredProducts.length === 0">
            <p>😕 No products found. Try different filters.</p>
            <button class="clear-btn" @click="clearFilters">Clear Filters</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Products - Ecommerce Store' })

const { get } = useApi()
const cartStore = useCartStore()
const route = useRoute()

// ===== STATE =====
const allProducts = ref([])
const loading = ref(true)
const error = ref(null)
const selectedCategory = ref(route.query.category || 'All')
const selectedRating = ref(null)
const minPrice = ref(null)
const maxPrice = ref(null)
const sortBy = ref('default')
const viewMode = ref('grid')
const searchQuery = ref(route.query.search || '')

const categories = ['All', 'Phones', 'Laptops', 'Clothing', 'Shoes', 'Watches', 'Bags', 'Cameras', 'Headphones']

// ===== FETCH PRODUCTS FROM BACKEND =====
onMounted(async () => {
  const { data, error: err } = await get('/products/?page_size=100')
  if (err) {
    error.value = err
  } else {
    allProducts.value = data.results
  }
  loading.value = false
})

// ===== WATCH SEARCH QUERY =====
watch(() => route.query.search, (newSearch) => {
  searchQuery.value = newSearch || ''
})

// ===== WATCH CATEGORY QUERY =====
watch(() => route.query.category, (newCategory) => {
  selectedCategory.value = newCategory || 'All'
})

// ===== COMPUTED: FILTERED + SORTED =====
const filteredProducts = computed(() => {
  let result = [...allProducts.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value !== 'All') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  if (minPrice.value) {
    result = result.filter(p => p.price >= minPrice.value)
  }
  if (maxPrice.value) {
    result = result.filter(p => p.price <= maxPrice.value)
  }

  if (selectedRating.value) {
    result = result.filter(p => p.rating >= selectedRating.value)
  }

  if (sortBy.value === 'price-low')  result.sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-high') result.sort((a, b) => b.price - a.price)
  if (sortBy.value === 'name')       result.sort((a, b) => a.name.localeCompare(b.name))

  return result
})

// ===== METHODS =====
const clearFilters = () => {
  selectedCategory.value = 'All'
  selectedRating.value = null
  minPrice.value = null
  maxPrice.value = null
  sortBy.value = 'default'
}

const addToCart = (product) => {
  cartStore.addToCart(product)
}
</script>

<style scoped>
.products-page {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ===== LAYOUT ===== */
.page-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 30px;
  align-items: start;
}

/* ===== SIDEBAR ===== */
.sidebar {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  position: sticky;
  top: 80px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f1f5f9;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-heading {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.filter-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.filter-item {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #475569;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.filter-item:hover {
  background-color: #eff6ff;
  color: #2563eb;
}

.filter-item.active {
  background-color: #2563eb;
  color: white;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-input {
  width: 80px;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
}

.price-input:focus {
  border-color: #2563eb;
}

.clear-btn {
  width: 100%;
  padding: 10px;
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #fecaca;
}

/* ===== TOP BAR ===== */
.products-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.results-count {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-select {
  padding: 7px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  cursor: pointer;
}

.view-btn {
  padding: 7px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.view-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

/* ===== PRODUCTS GRID ===== */
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.products-list .product-card {
  display: flex;
  flex-direction: row;
}

.products-list .product-image {
  width: 180px;
  flex-shrink: 0;
}

/* ===== PRODUCT CARD ===== */
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.1);
}

.product-image {
  position: relative;
  background: #f8fafc;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.product-image img {
  max-height: 150px;
  max-width: 100%;
  object-fit: contain;
}

.product-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
}

.product-info {
  padding: 14px;
}

.product-category {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}

.product-rating {
  font-size: 12px;
  margin-bottom: 10px;
}

.rating-count {
  color: #94a3b8;
  font-size: 11px;
  margin-left: 4px;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-group {
  display: flex;
  flex-direction: column;
}

.product-price {
  font-size: 17px;
  font-weight: 700;
  color: #2563eb;
}

.old-price {
  font-size: 12px;
  color: #94a3b8;
  text-decoration: line-through;
}

.add-to-cart {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.add-to-cart:hover {
  background: #1d4ed8;
}

/* ===== NO PRODUCTS ===== */
.no-products {
  text-align: center;
  padding: 60px 0;
  color: #64748b;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .page-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .products-list .product-card {
    flex-direction: column;
  }

  .products-list .product-image {
    width: 100%;
  }

  .loading-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.skeleton-card {
  height: 280px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
}
</style>