import { useState } from 'react'
import { useRouter } from 'next/router'
import { Eye, EyeOff, Building, User, MapPin, Users, Phone } from 'lucide-react'
import apiService from '../services/api'

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [testingConnection, setTestingConnection] = useState(false)
  const [fetchedOTP, setFetchedOTP] = useState('')
  const [showFetchedOTP, setShowFetchedOTP] = useState(false)
  const router = useRouter()

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    // Client-side validation
    if (!phoneNumber || phoneNumber.trim() === '') {
      setError('Please enter your phone number')
      return
    }
    
    setLoading(true)

    try {
      console.log('📱 Sending OTP to phone number:', phoneNumber)
      const response = await apiService.sendOTP(phoneNumber)
      console.log('✅ OTP sent successfully:', response)
      
      setOtpSent(true)
      setSuccess('OTP sent successfully! Please check your phone.')
      
      // Fetch the OTP that was just generated
      setTimeout(async () => {
        try {
          console.log('🔍 Fetching generated OTP...')
          const otpResponse = await apiService.getOTP(phoneNumber)
          console.log('📱 Fetched OTP:', otpResponse)
          
          if (otpResponse.success && otpResponse.data && otpResponse.data.length > 0) {
            const otpCode = otpResponse.data[0].otp_code
            setFetchedOTP(otpCode)
            setShowFetchedOTP(true)
            console.log('✅ OTP fetched and displayed:', otpCode)
          }
        } catch (otpErr) {
          console.error('❌ Error fetching OTP:', otpErr)
          // Don't show error to user, just log it
        }
      }, 1000) // Wait 1 second after OTP is sent
      
    } catch (err) {
      console.error('❌ Error sending OTP:', err)
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    // Client-side validation
    if (!phoneNumber || phoneNumber.trim() === '') {
      setError('Phone number is required')
      return
    }
    
    if (!otp || otp.trim() === '') {
      setError('OTP is required')
      return
    }
    
    setLoading(true)

    try {
      console.log('🔐 Attempting login with OTP...')
      const response = await apiService.loginWithOTP(phoneNumber, otp)
      console.log('✅ Login successful:', response)
      
      if (response.success && response.userExists) {
        setSuccess('Login successful! Redirecting...')
        
        // Debug: Log EVERYTHING to find the role
        console.log('=' .repeat(60))
        console.log('🔍 DEBUGGING LOGIN RESPONSE')
        console.log('=' .repeat(60))
        console.log('Full response:', JSON.stringify(response, null, 2))
        console.log('User object:', JSON.stringify(response.user, null, 2))
        console.log('=' .repeat(60))
        
        // Try ALL possible ways to get the role
        const possibleRoles = {
          'response.user.role': response.user?.role,
          'response.user.user_type': response.user?.user_type,
          'response.user.userType': response.user?.userType,
          'response.user.Role': response.user?.Role,
          'response.user.USER_TYPE': response.user?.USER_TYPE,
          'response.user.type': response.user?.type,
          'response.user.designation': response.user?.designation,
          'response.role': response.role,
          'response.userRole': response.userRole,
        }
        
        console.log('🔎 Checking all possible role fields:', possibleRoles)
        
        // Get the first non-null/non-undefined role
        let userRole = null
        for (const [key, value] of Object.entries(possibleRoles)) {
          if (value) {
            console.log(`✅ Found role in ${key}: "${value}"`)
            userRole = value
            break
          }
        }
        
        // If still no role found, use default
        if (!userRole) {
          console.log('⚠️ NO ROLE FOUND! Using default: asha')
          userRole = 'asha'
        }
        
        console.log('📝 Final selected role:', userRole)
        
        // Store user data
        localStorage.setItem('userRole', userRole)
        localStorage.setItem('userData', JSON.stringify(response.user))
        
        // Route based on role (case-insensitive comparison)
        setTimeout(() => {
          const roleUpper = String(userRole).toUpperCase().trim()
          console.log('🔀 Normalized role for routing:', roleUpper)
          
          let targetRoute = '/asha-dashboard' // default
          
          if (roleUpper === 'ASHA') {
            targetRoute = '/asha-dashboard'
            console.log('➡️ Route decision: ASHA → /asha-dashboard')
          } else if (roleUpper === 'DLO') {
            targetRoute = '/district-dashboard'
            console.log('➡️ Route decision: DLO → /district-dashboard')
          } else if (roleUpper === 'PHC') {
            targetRoute = '/taluk-dashboard'
            console.log('➡️ Route decision: PHC → /taluk-dashboard')
          } else {
            console.log(`⚠️ Unknown role "${roleUpper}", defaulting to /asha-dashboard`)
          }
          
          console.log('🚀 Redirecting to:', targetRoute)
          console.log('=' .repeat(60))
          router.push(targetRoute)
        }, 1000)
      } else if (response.success && !response.userExists) {
        setError('User not found in system. Please contact administrator.')
      } else {
        setError(response.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      console.error('❌ Error logging in:', err)
      setError(err.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    setTestingConnection(true)
    setError('')
    setSuccess('')
    
    try {
      console.log('🔍 Testing connection to server...')
      const response = await fetch('http://192.168.3.74:3000/api/v1/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: '1234567890' })
      })
      
      const data = await response.json()
      console.log('📡 Connection test response:', response.status, response.statusText)
      console.log('📦 Response data:', data)
      
      if (response.ok) {
        setSuccess('✅ Server connection successful! API is working.')
      } else {
        setError(`❌ Server responded with: ${response.status} ${response.statusText}`)
      }
    } catch (err) {
      console.error('❌ Connection test failed:', err)
      setError(`❌ Cannot connect to server: ${err.message}`)
    } finally {
      setTestingConnection(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            AMRSense Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your role-based dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={otpSent ? handleLogin : handleSendOTP}>
          <div className="space-y-4">
            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  disabled={otpSent}
                  className="appearance-none relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            {/* OTP Input - Only show after OTP is sent */}
            {otpSent && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  OTP
                </label>
                
                {/* Show fetched OTP if available */}
                {showFetchedOTP && fetchedOTP && (
                  <div className="mb-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Generated OTP: <span className="font-mono text-lg font-bold">{fetchedOTP}</span>
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          You can copy this OTP or wait for SMS
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
                
                {/* Auto-fill button if OTP is fetched */}
                {showFetchedOTP && fetchedOTP && (
                  <button
                    type="button"
                    onClick={() => setOtp(fetchedOTP)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Use generated OTP: {fetchedOTP}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (otpSent ? 'Login' : 'Send OTP')}
            </button>

            {otpSent && (
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false)
                  setOtp('')
                  setError('')
                  setSuccess('')
                }}
                className="w-full text-sm text-blue-600 hover:text-blue-800"
              >
                Change phone number
              </button>
            )}

            {/* Test Connection Button */}
            <button
              type="button"
              onClick={testConnection}
              disabled={testingConnection}
              className="w-full text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded px-3 py-2 disabled:opacity-50"
            >
              {testingConnection ? 'Testing...' : 'Test Server Connection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
