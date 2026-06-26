<template>
  <div class="admin-page">

    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="admin-logo">🛒 Admin Panel</div>
      <ul class="admin-menu">
        <li
          :class="{ active: activeTab === 'dashboard' }"
          @click="activeTab = 'dashboard'"
        >
          📊 Dashboard
        </li>
        <li
          :class="{ active: activeTab === 'products' }"
          @click="activeTab = 'products'"
        >
          📦 Products
        </li>
        <li
          :class="{ active: activeTab === 'add' }"
          @click="openAddForm"
        >
          ➕ Add Product
        </li>
      </ul>
      <NuxtLink to="/" class="back-link">← Back to Store</NuxtLink>
    </aside>

    <!-- Main Content -->
    <main class="admin-main">

      <!-- ===== DASHBOARD TAB ===== -->
      <div v-if="activeTab === 'dashboard'">
        <h1 class="page-heading">Dashboard</h1>

        <div class="stats-grid">
          <div class="stat-card">
            <p class="stat-label">Total Products</p>
            <p class="stat-value">{{ products.length }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">In Stock</p>
            <p class="stat-value">{{ inStockCount }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Out of Stock</p>
            <p class="stat-value">{{ outOfStockCount }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Categories</p>
            <p class="stat-value">{{ categoryCount }}</p>
          </div>
        </div>

        <div class="recent-section">
          <h2 class="section-subtitle">Recent Products</h2>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in products.slice(0, 5)" :key="p.id">
                <td><img :src="p.image" class="table-img" /></td>
                <td>{{ p.name }}</td>
                <td>{{ p.category }}</td>
                <td>${{ p.price }}</td>
                <td>
                  <span :class="p.stock > 0 ? 'badge-in' : 'badge-out'">
                    {{ p.stock > 0 ? p.stock + ' units' : 'Out of stock' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ===== PRODUCTS TAB ===== -->
      <div v-if="activeTab === 'products'">
        <div class="page-header">
          <h1 class="page-heading">All Products</h1>
          <button class="btn-add" @click="openAddForm">+ Add New Product</button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td><img :src="p.image" class="table-img" /></td>
              <td>{{ p.name }}</td>
              <td>{{ p.category }}</td>
              <td>${{ p.price }}</td>
              <td>
                <span :class="p.stock > 0 ? 'badge-in' : 'badge-out'">
                  {{ p.stock > 0 ? p.stock : 'Out' }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn-edit" @click="editProduct(p)">✏️ Edit</button>
                <button class="btn-delete" @click="deleteProduct(p.id)">🗑️ Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ===== ADD/EDIT PRODUCT TAB ===== -->
      <div v-if="activeTab === 'add'">
        <h1 class="page-heading">{{ editingId ? 'Edit Product' : 'Add New Product' }}</h1>

        <div class="form-card">

          <div class="form-grid">

            <div class="form-group">
              <label>Product Name</label>
              <input type="text" v-model="form.name" placeholder="e.g. iPhone 14 Pro" class="form-input" />
            </div>

            <div class="form-group">
              <label>Category</label>
              <select v-model="form.category" class="form-input">
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Price ($)</label>
              <input type="number" v-model="form.price" placeholder="0.00" class="form-input" />
            </div>

            <div class="form-group">
              <label>Stock Quantity</label>
              <input type="number" v-model="form.stock" placeholder="0" class="form-input" />
            </div>

            <div class="form-group full-width">
              <label>Image URL</label>
              <input type="text" v-model="form.image" placeholder="https://..." class="form-input" />
            </div>

            <div class="form-group full-width">
              <label>Description</label>
              <textarea v-model="form.description" rows="4" placeholder="Product description..." class="form-input"></textarea>
            </div>

          </div>

          <!-- Image Preview -->
          <div class="image-preview" v-if="form.image">
            <p class="preview-label">Preview:</p>
            <img :src="form.image" class="preview-img" />
          </div>

          <div class="form-actions">
            <button class="btn-cancel" @click="cancelForm">Cancel</button>
            <button class="btn-save" @click="saveProduct" :disabled="saveLoading">
              {{ saveLoading ? 'Saving...' : (editingId ? 'Update Product' : 'Save Product') }}
            </button>
          </div>

        </div>
      </div>

    </main>
  </div>
</template>
<script setup>
definePageMeta({
  layout: 'auth',
  middleware: 'admin'
})
useHead({ title: 'Admin Panel - Ecommerce Store' })

const { get, post, put, remove } = useApi()

const activeTab = ref('dashboard')
const editingId = ref(null)
const loading = ref(true)
const saveLoading = ref(false)

const categories = ['Phones', 'Laptops', 'Clothing', 'Shoes', 'Watches', 'Bags', 'Cameras', 'Headphones']

// Products data
const products = ref([])

// Form state
const form = ref({
  name: '',
  category: '',
  price: '',
  stock: '',
  image: '',
  description: ''
})

// ===== FETCH PRODUCTS =====
onMounted(async () => {
  await fetchProducts()
})

const fetchProducts = async () => {
  loading.value = true
  const { data, error } = await get('/products/?page_size=100')
  if (!error) {
    products.value = data.results
  }
  loading.value = false
}

// ===== STATS =====
const inStockCount = computed(() => products.value.filter(p => p.stock > 0).length)
const outOfStockCount = computed(() => products.value.filter(p => p.stock === 0).length)
const categoryCount = computed(() => new Set(products.value.map(p => p.category)).size)

// ===== OPEN ADD FORM =====
const openAddForm = () => {
  editingId.value = null
  form.value = { name: '', category: '', price: '', stock: '', image: '', description: '' }
  activeTab.value = 'add'
}

// ===== EDIT PRODUCT =====
const editProduct = (product) => {
  editingId.value = product.id
  form.value = {
    name: product.name,
    category: product.category,
    price: product.price,
    stock: product.stock,
    image: product.image,
    description: product.description
  }
  activeTab.value = 'add'
}

// ===== DELETE PRODUCT =====
const deleteProduct = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return

  const { error } = await remove(`/products/${id}/`)
  if (!error) {
    await fetchProducts()
    alert('Product deleted successfully!')
  } else {
    alert('Error deleting product. Please try again.')
  }
}

// ===== SAVE PRODUCT (ADD OR UPDATE) =====
const saveProduct = async () => {
  if (!form.value.name || !form.value.category || !form.value.price) {
    alert('Please fill all required fields')
    return
  }

  saveLoading.value = true

  const productData = {
    name: form.value.name,
    category: form.value.category,
    price: parseFloat(form.value.price),
    stock: parseInt(form.value.stock) || 0,
    image: form.value.image,
    description: form.value.description
  }

  if (editingId.value) {
    // Update existing product
    const { error } = await put(`/products/${editingId.value}/`, productData)
    if (!error) {
      await fetchProducts()
      activeTab.value = 'products'
      alert('Product updated successfully!')
    } else {
      alert('Error updating product.')
    }
  } else {
    // Add new product
    const { error } = await post('/products/', productData)
    if (!error) {
      await fetchProducts()
      activeTab.value = 'products'
      alert('Product added successfully!')
    } else {
      console.error('Save error:', error)
      alert('Error: ' + JSON.stringify(error))
    }
  }

  saveLoading.value = false
}

const cancelForm = () => {
  activeTab.value = 'products'
}
</script>

<style scoped>
.admin-page {
  display: flex;
  min-height: 100vh;
  background: #f1f5f9;
}

/* Sidebar */
.admin-sidebar {
  width: 240px;
  background: #1e293b;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
}

.admin-logo {
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 30px;
  padding: 0 8px;
}

.admin-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.admin-menu li {
  padding: 12px 16px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 6px;
  transition: all 0.2s;
}

.admin-menu li:hover {
  background: #334155;
  color: white;
}

.admin-menu li.active {
  background: #2563eb;
  color: white;
}

.back-link {
  color: #94a3b8;
  text-decoration: none;
  font-size: 13px;
  padding: 12px 16px;
}

.back-link:hover {
  color: white;
}

/* Main */
.admin-main {
  flex: 1;
  padding: 30px 40px;
  overflow-y: auto;
}

.page-heading {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.btn-add {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-add:hover {
  background: #1d4ed8;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.stat-label {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.section-subtitle {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

/* Table */
.admin-table {
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border-collapse: collapse;
}

.admin-table thead {
  background: #f8fafc;
}

.admin-table th {
  text-align: left;
  padding: 14px 16px;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.admin-table td {
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  border-top: 1px solid #f1f5f9;
}

.table-img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  background: #f8fafc;
  border-radius: 6px;
  padding: 4px;
}

.badge-in {
  background: #dcfce7;
  color: #16a34a;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-out {
  background: #fee2e2;
  color: #ef4444;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete {
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.btn-edit {
  background: #dbeafe;
  color: #2563eb;
}

.btn-delete {
  background: #fee2e2;
  color: #ef4444;
}

/* Form */
.form-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  max-width: 800px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: span 2;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.form-input {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
}

.form-input:focus {
  border-color: #2563eb;
}

.image-preview {
  margin-top: 20px;
}

.preview-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.preview-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid #e2e8f0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel {
  padding: 10px 24px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
}

.btn-save {
  padding: 10px 24px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
}

.btn-save:hover {
  background: #1d4ed8;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-page {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: span 1;
  }

  /* YEH NAYA HAI - table scroll wrapper */
  .admin-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .admin-main {
    padding: 20px;
  }
}
</style>