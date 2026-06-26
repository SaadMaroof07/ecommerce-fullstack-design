<template>
  <div class="auth-page">
    <div class="auth-container">

      <!-- Left Side: Banner -->
      <div class="auth-banner">
        <div class="banner-content">
          <h1>Join Us Today!</h1>
          <p>Create your account and start shopping the best products at best prices.</p>
          <div class="banner-features">
            <div class="feature">✓ Free shipping on first order</div>
            <div class="feature">✓ Exclusive member deals</div>
            <div class="feature">✓ Easy returns</div>
            <div class="feature">✓ 24/7 support</div>
          </div>
        </div>
      </div>

      <!-- Right Side: Form -->
      <div class="auth-form-side">
        <div class="auth-form-box">

          <!-- Logo -->
          <a href="/" class="auth-logo">🛒 Ecommerce</a>

          <h2 class="form-title">Create your account</h2>
          <p class="form-subtitle">Fill in the details below to get started</p>

          <!-- Error Message -->
          <div class="error-msg" v-if="errorMsg">
            ⚠️ {{ errorMsg }}
          </div>

          <!-- Success Message -->
          <div class="success-msg" v-if="successMsg">
            ✅ {{ successMsg }}
          </div>

          <!-- Form -->
          <div class="form">

            <!-- Name Row -->
            <div class="form-row">
              <div class="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  v-model="firstName"
                  placeholder="John"
                  class="form-input"
                  :class="{ 'input-error': firstNameError }"
                  @blur="validateFirstName"
                />
                <span class="field-error" v-if="firstNameError">{{ firstNameError }}</span>
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  v-model="lastName"
                  placeholder="Doe"
                  class="form-input"
                />
              </div>
            </div>

            <!-- Username -->
            <div class="form-group full-width">
              <label>Username</label>
              <input
                type="text"
                v-model="username"
                placeholder="e.g. john_doe"
                class="form-input"
                :class="{ 'input-error': usernameError }"
                @blur="validateUsername"
              />
              <span class="field-error" v-if="usernameError">{{ usernameError }}</span>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label>Email Address</label>
              <input
                type="email"
                v-model="email"
                placeholder="you@example.com"
                class="form-input"
                :class="{ 'input-error': emailError }"
                @blur="validateEmail"
              />
              <span class="field-error" v-if="emailError">{{ emailError }}</span>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label>Password</label>
              <div class="input-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="Min 6 characters"
                  class="form-input"
                  :class="{ 'input-error': passwordError }"
                  @blur="validatePassword"
                />
                <button class="toggle-pass" @click="showPassword = !showPassword">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <span class="field-error" v-if="passwordError">{{ passwordError }}</span>

              <!-- Password Strength -->
              <div class="strength-bar" v-if="password">
                <div
                  class="strength-fill"
                  :style="{ width: strengthPercent + '%' }"
                  :class="strengthClass"
                ></div>
              </div>
              <span class="strength-text" v-if="password">{{ strengthLabel }}</span>
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
              <label>Confirm Password</label>
              <div class="input-wrapper">
                <input
                  :type="showConfirm ? 'text' : 'password'"
                  v-model="confirmPassword"
                  placeholder="Repeat your password"
                  class="form-input"
                  :class="{ 'input-error': confirmError }"
                  @blur="validateConfirm"
                />
                <button class="toggle-pass" @click="showConfirm = !showConfirm">
                  {{ showConfirm ? '🙈' : '👁️' }}
                </button>
              </div>
              <span class="field-error" v-if="confirmError">{{ confirmError }}</span>
            </div>

            <!-- Terms -->
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="agreeTerms" />
                <span>I agree to the <a href="#" class="terms-link">Terms & Conditions</a></span>
              </label>
              <span class="field-error" v-if="termsError">{{ termsError }}</span>
            </div>

            <!-- Submit -->
            <button
              class="submit-btn"
              @click="handleSignup"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Creating account...</span>
              <span v-else>Create Account →</span>
            </button>

          </div>

          <!-- Divider -->
          <div class="divider">
            <span>or sign up with</span>
          </div>

          <!-- Social -->
          <div class="social-btns">
            <button class="social-btn">🌐 Google</button>
            <button class="social-btn">📘 Facebook</button>
          </div>

          <!-- Login Link -->
          <p class="switch-link">
            Already have an account?
            <a href="/login">Login here</a>
          </p>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '~/stores/user'
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Sign Up - Ecommerce Store' })

const { post } = useApi()
const userStore = useUserStore()
const config = useRuntimeConfig()

// Form state
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// Errors
const firstNameError = ref('')
const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmError = ref('')
const termsError = ref('')

// Password strength
const strengthPercent = computed(() => {
  if (!password.value) return 0
  let score = 0
  if (password.value.length >= 6)  score += 25
  if (password.value.length >= 10) score += 25
  if (/[A-Z]/.test(password.value)) score += 25
  if (/[0-9]/.test(password.value)) score += 25
  return score
})

const strengthClass = computed(() => {
  if (strengthPercent.value <= 25) return 'weak'
  if (strengthPercent.value <= 50) return 'fair'
  if (strengthPercent.value <= 75) return 'good'
  return 'strong'
})

const strengthLabel = computed(() => {
  if (strengthPercent.value <= 25) return '😟 Weak'
  if (strengthPercent.value <= 50) return '😐 Fair'
  if (strengthPercent.value <= 75) return '🙂 Good'
  return '💪 Strong'
})

// Validations
const validateFirstName = () => {
  firstNameError.value = !firstName.value ? 'First name is required' : ''
}

const validateUsername = () => {
  if (!username.value) {
    usernameError.value = 'Username is required'
  } else if (username.value.length < 3) {
    usernameError.value = 'Username must be at least 3 characters'
  } else {
    usernameError.value = ''
  }
}

const validateEmail = () => {
  if (!email.value) {
    emailError.value = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    emailError.value = 'Please enter a valid email'
  } else {
    emailError.value = ''
  }
}

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Password is required'
  } else if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
  } else {
    passwordError.value = ''
  }
}

const validateConfirm = () => {
  if (!confirmPassword.value) {
    confirmError.value = 'Please confirm your password'
  } else if (confirmPassword.value !== password.value) {
    confirmError.value = 'Passwords do not match'
  } else {
    confirmError.value = ''
  }
}

// Signup handler
const handleSignup = async () => {
  validateFirstName()
  validateUsername()
  validateEmail()
  validatePassword()
  validateConfirm()

  if (!agreeTerms.value) {
    termsError.value = 'You must agree to the terms'
  } else {
    termsError.value = ''
  }

  if (
    firstNameError.value ||
    usernameError.value ||
    emailError.value ||
    passwordError.value ||
    confirmError.value ||
    termsError.value
  ) return

  isLoading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    // Step 1: Register karo
    const { data, error } = await post('/accounts/register/', {
      username: username.value,
      email: email.value,
      password: password.value,
      confirm_password: confirmPassword.value,
      first_name: firstName.value,
      last_name: lastName.value,
    })

    if (error || !data) {
      if (typeof error === 'object') {
        const messages = Object.values(error).flat()
        errorMsg.value = messages[0] || 'Registration failed. Please try again.'
      } else {
        errorMsg.value = error || 'Registration failed. Please try again.'
      }
      return
    }

    // Step 2: Auto login — tokens already mile hain register response mein
    const profile = await $fetch(`${config.public.apiBase}/accounts/profile/`, {
      headers: { Authorization: `Bearer ${data.tokens.access}` }
    })

    // Step 3: Store mein save karo
    userStore.setAuth(profile, {
      access: data.tokens.access,
      refresh: data.tokens.refresh
    })

    successMsg.value = 'Account created! Redirecting...'

    // Step 4: Redirect
    await new Promise(resolve => setTimeout(resolve, 1000))
    navigateTo('/')

  } catch (err) {
    errorMsg.value = 'Something went wrong. Please try again.'
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

/* Banner */
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

/* Form Side */
.auth-form-side {
  background: white;
  padding: 40px;
  display: flex;
  align-items: flex-start;
  overflow-y: auto;
  max-height: 100vh;
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
  margin-bottom: 20px;
}

.form-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.form-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 20px;
}

.error-msg {
  background: #fee2e2;
  color: #ef4444;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
}

.success-msg {
  background: #dcfce7;
  color: #16a34a;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
}

/* Form Row (2 columns) */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
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

/* Password Strength */
.strength-bar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 4px;
  margin-top: 8px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s, background 0.3s;
}

.strength-fill.weak   { background: #ef4444; }
.strength-fill.fair   { background: #f59e0b; }
.strength-fill.good   { background: #3b82f6; }
.strength-fill.strong { background: #16a34a; }

.strength-text {
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
  display: block;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}

.terms-link {
  color: #2563eb;
  text-decoration: none;
}

/* Submit */
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

.submit-btn:hover { background: #1d4ed8; }
.submit-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

/* Divider */
.divider {
  text-align: center;
  position: relative;
  margin: 20px 0;
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

/* Social */
.social-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
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

/* Switch Link */
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

/* Responsive */
@media (max-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr;
  }

  .auth-banner {
    display: none;
  }

  .auth-form-side {
    padding: 30px 20px;
    align-items: flex-start;
    min-height: 100vh;
  }

  .auth-form-side {
    padding: 30px 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>