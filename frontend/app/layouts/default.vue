<template>
  <div class="site-wrapper">

    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="nav-container">

        <!-- Logo -->
        <NuxtLink to="/" class="logo">🛒 Ecommerce</NuxtLink>

        <!-- Nav Links (Desktop) -->
        <ul class="nav-links" :class="{ 'mobile-open': mobileMenuOpen }">
          <li><NuxtLink to="/" @click="mobileMenuOpen = false">Home</NuxtLink></li>
          <li><NuxtLink to="/products" @click="mobileMenuOpen = false">Products</NuxtLink></li>
          <li class="mobile-only"><NuxtLink to="/login" @click="mobileMenuOpen = false">Login</NuxtLink></li>
          <li class="mobile-only"><NuxtLink to="/signup" @click="mobileMenuOpen = false">Sign Up</NuxtLink></li>
        </ul>

        <!-- Search + Cart -->
      <div class="nav-right">
        <input
  type="search"
  v-model="searchQuery"
  @keyup.enter="handleSearch"
  placeholder="Search products..."
  class="search-input"
/>

  
  <!-- Logged out: Login button -->
  <NuxtLink to="/login" class="login-link" v-if="!userStore.isLoggedIn">
    Login
  </NuxtLink>

  <!-- Logged in: User menu -->
  <div class="user-menu" v-else>
    <div class="user-info" @click="userMenuOpen = !userMenuOpen">
      <span class="user-avatar">👤</span>
      <span class="user-name">{{ userStore.currentUser?.username }}</span>
      <span>▾</span>
    </div>
    <div class="user-dropdown" v-if="userMenuOpen">
      <NuxtLink
        to="/admin"
        class="dropdown-item"
        v-if="userStore.isAdmin"
        @click="userMenuOpen = false"
      >
        ⚙️ Admin Panel
      </NuxtLink>
      <button class="dropdown-item logout-btn" @click="userStore.logout()">
        🚪 Logout
      </button>
    </div>
  </div>

  <NuxtLink to="/cart" class="cart-btn">
    🛒 <span class="cart-count">{{ cartStore.totalItems }}</span>
  </NuxtLink>

  <button class="hamburger-btn" @click="mobileMenuOpen = !mobileMenuOpen">
    <span v-if="!mobileMenuOpen">☰</span>
    <span v-else>✕</span>
  </button>
</div>

      </div>
    </nav>

    <!-- PAGE CONTENT -->
    <main>
      <slot />
    </main>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-col">
          <h3>🛒 Ecommerce</h3>
          <p>Best products at best prices.</p>
        </div>
        <div class="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <li><NuxtLink to="/products">Products</NuxtLink></li>
            <li><NuxtLink to="/cart">Cart</NuxtLink></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Contact</h3>
          <p>support@ecommerce.com</p>
        </div>
      </div>
      <p class="footer-bottom">© 2024 Ecommerce. All rights reserved.</p>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useUserStore } from '~/stores/user'

const cartStore = useCartStore()
const userStore = useUserStore()
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const searchQuery = ref('')

onMounted(() => {
  userStore.restoreAuth()
  cartStore.restoreCart()
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/products?search=${encodeURIComponent(searchQuery.value)}`)
  }
}
</script>

<style scoped>
/* ===== GLOBAL WRAPPER ===== */
.site-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ===== NAVBAR ===== */
.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  padding: 14px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  color: #2563eb;
  text-decoration: none;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 30px;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #2563eb;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-input {
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  width: 200px;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #2563eb;
}

.cart-btn {
  background-color: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  position: relative;
}

.cart-count {
  background: #ef4444;
  color: white;
  border-radius: 50%;
  padding: 1px 6px;
  font-size: 11px;
  margin-left: 4px;
}

  /* User Menu */
  .user-menu {
    position: relative;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 25px;
    border: 1px solid #e2e8f0;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    transition: all 0.2s;
  }

  .user-info:hover {
    border-color: #2563eb;
    color: #2563eb;
  }

  .user-avatar {
    font-size: 18px;
  }

  .user-name {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: white;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    min-width: 160px;
    overflow: hidden;
    z-index: 200;
  }

  .dropdown-item {
    display: block;
    padding: 12px 16px;
    font-size: 14px;
    color: #374151;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s;
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
  }

  .dropdown-item:hover {
    background: #f0f4ff;
    color: #2563eb;
  }

  .logout-btn {
    color: #ef4444;
  }

  .logout-btn:hover {
    background: #fee2e2;
    color: #ef4444;
  }

/* ===== MAIN ===== */
main {
  flex: 1;
}

.footer {
  background-color: #1e293b;
  color: #94a3b8;
  padding: 50px 0 20px;
  margin-top: 80px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.footer-col h3 {
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 15px;
}

.footer-col p {
  font-size: 14px;
  line-height: 1.6;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col ul li {
  margin-bottom: 8px;
}

.footer-col ul li a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-col ul li a:hover {
  color: #ffffff;
}

.footer-bottom {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #334155;
  font-size: 13px;
}

/* ===== RESPONSIVE (Mobile) ===== */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .login-link {
    display: none;
  }

  .search-input {
    width: 140px;
  }

  .footer-container {
    flex-direction: column;
    gap: 30px;
  }
}

/* ===== HAMBURGER BUTTON ===== */
.hamburger-btn {
  display: none;
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #1e293b;
}

.mobile-only {
  display: none;
}

/* ===== MOBILE RESPONSIVE UPDATES ===== */
@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    gap: 0;
    padding: 10px 0;
    border-top: 1px solid #e0e0e0;
    box-shadow: 0 8px 16px rgba(0,0,0,0.08);
  }

  .nav-links.mobile-open {
    display: flex;
  }

  .nav-links li {
    width: 100%;
  }

  .nav-links a {
    display: block;
    padding: 12px 20px;
  }

  .nav-links a:hover {
    background: #f0f4ff;
  }

  .mobile-only {
    display: block;
  }

  .hamburger-btn {
    display: block;
  }

  .nav-container {
    position: relative;
  }
}

.login-link {
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border: 1px solid #2563eb;
  border-radius: 25px;
  transition: all 0.2s;
}

.login-link:hover {
  background: #2563eb;
  color: white;
}
</style>