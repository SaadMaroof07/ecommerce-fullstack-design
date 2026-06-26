<template>
  <div>

    <!-- ===== HERO SECTION ===== -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">

          <!-- Left Side: Text -->
          <div class="hero-text">
            <p class="hero-tag">Best Prices Online</p>
            <h1 class="hero-title">
              Latest Trending <br/>
              <span class="highlight">Electronic Items</span>
            </h1>
            <p class="hero-desc">
              Discover the best electronics at unbeatable prices. 
              Quality products delivered to your door.
            </p>
            <div class="hero-buttons">
              <a href="/products" class="btn-primary">Shop Now</a>
              <a href="/products" class="btn-secondary">View All</a>
            </div>
          </div>

          <!-- Right Side: Image -->
          <div class="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500" 
              alt="Electronics"
            />
          </div>

        </div>
      </div>
    </section>

    <!-- ===== CATEGORIES SECTION ===== -->
    <section class="categories">
      <div class="container">
        <h2 class="section-title">Shop by Category</h2>
        <div class="categories-grid">
          <div 
            class="category-card" 
            v-for="category in categories" 
            :key="category.name"
            @click="$router.push('/products?category=' + category.name)"
            style="cursor: pointer;"
          >
            <span class="category-icon">{{ category.icon }}</span>
            <p class="category-name">{{ category.name }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FEATURED PRODUCTS SECTION ===== -->
    <section class="products">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Featured Products</h2>
          <a href="/products" class="view-all">View All →</a>
        </div>
        
    <!-- Loading -->
    <div class="loading-grid" v-if="loading">
      <div class="skeleton-card" v-for="n in 4" :key="n"></div>
    </div>

    <!-- Error -->
    <div class="error-state" v-else-if="error">
      <p>⚠️ Could not load products. Please try again.</p>
    </div>

    <!-- Products -->
    <div class="products-grid" v-else>
      <div
        class="product-card"
        v-for="product in featuredProducts"
        :key="product.id"
        @click="$router.push('/product/' + product.id)"
        style="cursor: pointer;"
      >
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
        </div>
        <div class="product-info">
          <p class="product-category">{{ product.category }}</p>
          <h3 class="product-name">{{ product.name }}</h3>
          <div class="product-bottom">
            <span class="product-price">${{ product.price }}</span>
            <button class="add-to-cart" @click="addToCart(product)">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>

    <!-- ===== BANNER SECTION ===== -->
    <section class="banner">
      <div class="container">
        <div class="banner-content">
          <div class="banner-text">
            <h2>Super Discount on more than 100 USD</h2>
            <p>Shop now and save big on your favorite electronics</p>
          </div>
          <a href="/products" class="banner-btn">Shop Now</a>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
useHead({ title: 'Home - Ecommerce Store' })

const { get } = useApi()

// Loading states
const loading = ref(true)
const error = ref(null)

// Data
const featuredProducts = ref([])
const categories = [
  { name: 'Phones',    icon: '📱' },
  { name: 'Laptops',   icon: '💻' },
  { name: 'Clothing',  icon: '👕' },
  { name: 'Shoes',     icon: '👟' },
  { name: 'Watches',   icon: '⌚' },
  { name: 'Bags',      icon: '👜' },
]

// Fetch products on page load
onMounted(async () => {
  const { data, error: err } = await get('/products/?page_size=8')
  if (err) {
    error.value = err
  } else {
    featuredProducts.value = data.results
  }
  loading.value = false
})

// Cart store
const cartStore = useCartStore()
const addToCart = (product) => {
  cartStore.addToCart(product)
}
</script>

<style scoped>
/* ===== CONTAINER ===== */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ===== HERO ===== */
.hero {
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
  padding: 80px 0;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.hero-text {
  flex: 1;
}

.hero-tag {
  color: #2563eb;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-title {
  font-size: 46px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
  margin-bottom: 20px;
}

.highlight {
  color: #2563eb;
}

.hero-desc {
  font-size: 16px;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 30px;
  max-width: 450px;
}

.hero-buttons {
  display: flex;
  gap: 15px;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: transparent;
  color: #2563eb;
  padding: 12px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  border: 2px solid #2563eb;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #2563eb;
  color: white;
}

.hero-image {
  flex: 1;
  text-align: center;
}

.hero-image img {
  width: 100%;
  max-width: 480px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.12);
}

/* ===== CATEGORIES ===== */
.categories {
  padding: 60px 0;
  background-color: #f8fafc;
}

.section-title {
  font-size: 26px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 30px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.category-card {
  background: white;
  border-radius: 12px;
  padding: 20px 10px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.category-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

.category-name {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin: 0;
}

/* ===== PRODUCTS ===== */
.products {
  padding: 60px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.view-all {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

.view-all:hover {
  text-decoration: underline;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.1);
}

.product-image {
  background-color: #f8fafc;
  padding: 20px;
  text-align: center;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  max-height: 140px;
  max-width: 100%;
  object-fit: contain;
}

.product-info {
  padding: 16px;
}

.product-category {
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.product-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
}

.add-to-cart {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-to-cart:hover {
  background-color: #1d4ed8;
}

/* ===== BANNER ===== */
.banner {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  padding: 50px 0;
  margin: 40px 0;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.banner-text h2 {
  color: white;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 8px;
}

.banner-text p {
  color: rgba(255,255,255,0.75);
  font-size: 15px;
}

.banner-btn {
  background-color: #f59e0b;
  color: white;
  padding: 14px 40px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 16px;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.banner-btn:hover {
  background-color: #d97706;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-desc {
    max-width: 100%;
  }

  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .banner-content {
    flex-direction: column;
    text-align: center;
  }

  /* Loading Skeleton */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
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

.error-state {
  text-align: center;
  padding: 40px;
  color: #ef4444;
}
}
</style>