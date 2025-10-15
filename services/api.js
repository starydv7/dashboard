// API Configuration
const API_BASE_URL = 'http://192.168.3.74:3000/api/v1'

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = null
  }

  // Set authentication token
  setToken(token) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token)
    }
  }

  // Get authentication token
  getToken() {
    if (this.token) return this.token
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken')
    }
    return null
  }

  // Clear authentication token
  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
    }
  }

  // Generic API call method
  async apiCall(endpoint, method = 'GET', body = null, requiresAuth = true) {
    const url = `${this.baseURL}${endpoint}`
    
    const headers = {
      'Content-Type': 'application/json',
    }

    if (requiresAuth) {
      const token = this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const config = {
      method,
      headers,
    }

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body)
    }

    try {
      console.log(`🔄 API Call: ${method} ${url}`)
      console.log('📋 Headers:', headers)
      if (body) console.log('📦 Request Body:', body)
      console.log('🔧 Full Config:', config)

      const response = await fetch(url, config)
      console.log(`📡 Response Status: ${response.status} ${response.statusText}`)
      
      const data = await response.json()
      console.log(`✅ Response from ${endpoint}:`, data)

      if (!response.ok) {
        console.error(`❌ API Error Response:`, {
          status: response.status,
          statusText: response.statusText,
          data: data
        })
        throw new Error(data.message || data.error || 'API request failed')
      }

      return data
    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the server is running.')
      }
      throw error
    }
  }

  // Authentication APIs
  async sendOTP(phoneNumber) {
    console.log('📱 Sending OTP to:', phoneNumber)
    
    // Validate phone number
    if (!phoneNumber || phoneNumber.trim() === '') {
      throw new Error('Phone number is required')
    }
    
    return await this.apiCall('/auth/send-otp', 'POST', { phoneNumber }, false)
  }

  async loginWithOTP(phoneNumber, otp) {
    console.log('🔐 Logging in with OTP:', { phoneNumber, otp })
    
    // Validate both fields
    if (!phoneNumber || phoneNumber.trim() === '') {
      throw new Error('Phone number is required')
    }
    
    if (!otp || otp.trim() === '') {
      throw new Error('OTP is required')
    }
    
    // Send data in the format your server expects
    const requestBody = {
      phoneNumber: phoneNumber,
      otpCode: otp  // Server expects 'otpCode', not 'otp'
    }
    
    const response = await this.apiCall('/auth/login-with-otp', 'POST', requestBody, false)
    
    // Log the FULL response to debug
    console.log('🔍 FULL LOGIN RESPONSE:', JSON.stringify(response, null, 2))
    
    // Handle the response based on your server's structure
    if (response.success && response.accessToken) {
      this.setToken(response.accessToken)
      console.log('✅ Login successful! Token saved:', response.accessToken)
      console.log('👤 User data from login:', JSON.stringify(response.user, null, 2))
      
      // Check if role is present
      if (response.user?.role || response.user?.user_type) {
        console.log('✅ Role found in login response:', response.user?.role || response.user?.user_type)
      } else {
        console.warn('⚠️ WARNING: Role not found in login response! Make sure backend includes role.')
      }
    } else if (response.success && !response.userExists) {
      console.log('⚠️ OTP verified but user not found in database')
      throw new Error('User not found. Please contact administrator.')
    } else {
      throw new Error(response.message || 'Login failed')
    }
    
    return response
  }

  // ASHA Dashboard APIs
  async getHouseholdsCompleted() {
    console.log('🏠 Fetching households completed data...')
    return await this.apiCall('/mis/households-completed', 'GET')
  }

  async getHouseholdsSickness() {
    console.log('🤒 Fetching households sickness data...')
    return await this.apiCall('/mis/households-sickness', 'GET')
  }

  async getCompletedCourses() {
    console.log('💊 Fetching completed courses data...')
    return await this.apiCall('/mis/completed-courses', 'GET')
  }

  async getMedicineSelf() {
    console.log('🏪 Fetching medicine self-medication data...')
    return await this.apiCall('/mis/medicine-self', 'GET')
  }

  async getWantInfo() {
    console.log('ℹ️ Fetching want info data...')
    return await this.apiCall('/mis/want-info', 'GET')
  }

  async getSymptomCategories() {
    console.log('🤒 Fetching symptom categories data...')
    return await this.apiCall('/mis/symptom-categories', 'GET')
  }

  async getWeeklyPrescriptionsScanned() {
    console.log('📋 Fetching weekly prescriptions scanned data...')
    return await this.apiCall('/mis/weekly-prescriptions-scanned', 'GET')
  }

  async getOTP(phoneNumber) {
    console.log('📱 Fetching OTP for phone number:', phoneNumber)
    return await this.apiCall(`/get-otp?phoneNumber=${phoneNumber}`, 'GET', null, false)
  }

  // Fetch all ASHA dashboard data at once
  async fetchAllAshaDashboardData() {
    console.log('🚀 Fetching all ASHA dashboard data...')
    console.log('='.repeat(50))
    
    try {
      const [
        householdsCompleted,
        householdsSickness,
        completedCourses,
        medicineSelf,
        wantInfo,
        symptomCategories,
        weeklyPrescriptions
      ] = await Promise.all([
        this.getHouseholdsCompleted(),
        this.getHouseholdsSickness(),
        this.getCompletedCourses(),
        this.getMedicineSelf(),
        this.getWantInfo(),
        this.getSymptomCategories(),
        this.getWeeklyPrescriptionsScanned()
      ])

      const allData = {
        householdsCompleted,
        householdsSickness,
        completedCourses,
        medicineSelf,
        wantInfo,
        symptomCategories,
        weeklyPrescriptions
      }

      console.log('='.repeat(50))
      console.log('📊 ALL ASHA DASHBOARD DATA:', allData)
      console.log('='.repeat(50))

      return allData
    } catch (error) {
      console.error('❌ Error fetching ASHA dashboard data:', error)
      throw error
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService()

export default apiService

