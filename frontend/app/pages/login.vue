<template>
  <div class="auth-page">
    <div class="auth-container">

      <!-- Left Side: Banner -->
      <div class="auth-banner">
        <div class="banner-content">
          <h1>Welcome Back!</h1>
          <p>Login to access your account, track orders and more.</p>
          <div class="banner-features">
            <div class="feature">✓ Track your orders</div>
            <div class="feature">✓ Save your wishlist</div>
            <div class="feature">✓ Exclusive deals</div>
            <div class="feature">✓ Fast checkout</div>
          </div>
        </div>
      </div>

      <!-- Right Side: Form -->
      <div class="auth-form-side">
        <div class="auth-form-box">

          <!-- Logo -->
          <NuxtLink to="/" class="auth-logo">🛒 Ecommerce</NuxtLink>

          <h2 class="form-title">Login to your account</h2>
          <p class="form-subtitle">Enter your credentials to continue</p>

          <!-- Error Message -->
          <div class="error-msg" v-if="errorMsg">
            ⚠️ {{ errorMsg }}
          </div>

          <!-- Form -->
          <div class="form">

            <!-- Username -->
            <div class="form-group">
              <label>Username</label>
              <input
                type="text"
                v-model="username"
                placeholder="Enter your username"
                class="form-input"
                :class="{ 'input-error': usernameError }"
                @blur="validateUsername"
              />
              <span class="field-error" v-if="usernameError">{{ usernameError }}</span>
            </div>

            <!-- Password -->
            <div class="form-group">
              <div class="label-row">
                <label>Password</label>
                <a href="#" class="forgot-link">Forgot password?</a>
              </div>
              <div class="input-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="Enter your password"
                  class="form-input"
                  :class="{ 'input-error': passwordError }"
                  @blur="validatePassword"
                />
                <button class="toggle-pass" @click="showPassword = !showPassword">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <span class="field-error" v-if="passwordError">{{ passwordError }}</span>
            </div>

            <!-- Remember Me -->
            <div class="remember-row">
              <label class="checkbox-label">
                <input type="checkbox" v-model="rememberMe" />
                <span>Remember me</span>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              class="submit-btn"
              @click="handleLogin"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Logging in...</span>
              <span v-else>Login →</span>
            </button>

          </div>

          <!-- Divider -->
          <div class="divider">
            <span>or continue with</span>
          </div>

          <!-- Social Login -->
          <div class="social-btns">
            <button class="social-btn">🌐 Google</button>
            <button class="social-btn">📘 Facebook</button>
          </div>

          <!-- Signup Link -->
          <p class="switch-link">
            Don't have an account?
            <NuxtLink to="/signup">Create account</NuxtLink>
          </p>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'auth' })
useHead({ title: 'Login - Ecommerce Store' })

const { post } = useApi()
const userStore = useUserStore()
const config = useRuntimeConfig()

// Form state
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')
const usernameError = ref('')
const passwordError = ref('')

// Validate username
const validateUsername = () => {
  if (!username.value) {
    usernameError.value = 'Username is required'
  } else {
    usernameError.value = ''
  }
}

// Validate password
const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Password is required'
  } else if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
  } else {
    passwordError.value = ''
  }
}

// Handle Login
const handleLogin = async () => {
  validateUsername()
  validatePassword()
  if (usernameError.value || passwordError.value) return

  isLoading.value = true
  errorMsg.value = ''

  try {
    // Step 1: JWT token lo
    const { data, error } = await post('/auth/login/', {
      username: username.value,
      password: password.value
    })

    if (error || !data) {
      errorMsg.value = 'Invalid username or password. Please try again.'
      return
    }

    // Step 2: Profile fetch karo token se
    const profile = await $fetch(`${config.public.apiBase}/accounts/profile/`, {
      headers: { Authorization: `Bearer ${data.access}` }
    })

    // Step 3: Store mein save karo
    userStore.setAuth(profile, {
      access: data.access,
      refresh: data.refresh
    })

    // Step 4: Redirect
    if (profile.is_staff) {
      navigateTo('/admin')
    } else {
      navigateTo('/')
    }

  } catch (err) {
    errorMsg.value = 'Invalid username or password. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4ff;
  padding: 20px;
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 900px;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.12);
}

/* Left Banner */
.auth-banner {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  padding: 60px 40px;
  display: flex;
  align-items: center;
}

.banner-content h1 {
  color: white;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 16px;
}

.banner-content p {
  color: rgba(255,255,255,0.8);
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 30px;
}

.banner-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature {
  color: rgba(255,255,255,0.9);
  font-size: 14px;
  font-weight: 500;
}

/* Right Form */
.auth-form-side {
  background: white;
  padding: 50px 40px;
  display: flex;
  align-items: center;
}

.auth-form-box {
  width: 100%;
}

.auth-logo {
  display: inline-block;
  font-size: 20px;
  font-weight: 700;
  color: #2563eb;
  text-decoration: none;
  margin-bottom: 30px;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.form-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 24px;
}

.error-msg {
  background: #fee2e2;
  color: #ef4444;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.forgot-link {
  font-size: 12px;
  color: #2563eb;
  text-decoration: none;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #2563eb;
}

.form-input.input-error {
  border-color: #ef4444;
}

.toggle-pass {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
}

.field-error {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
  display: block;
}

.remember-row {
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}

.submit-btn {
  width: 100%;
  padding: 13px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #1d4ed8;
}

.submit-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.divider {
  text-align: center;
  position: relative;
  margin: 24px 0;
  color: #94a3b8;
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 35%;
  height: 1px;
  background: #e2e8f0;
}

.divider::before { left: 0; }
.divider::after  { right: 0; }

.social-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 24px;
}

.social-btn {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.social-btn:hover {
  background: #f8fafc;
  border-color: #2563eb;
}

.switch-link {
  text-align: center;
  font-size: 13px;
  color: #64748b;
}

.switch-link a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

@media (max-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr;
  }

  .auth-banner {
    display: none;
  }

  .auth-form-side {
    padding: 40px 24px;
  }
}
</style>