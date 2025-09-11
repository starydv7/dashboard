import { useState } from 'react'
import { useRouter } from 'next/router'
import { Eye, EyeOff, Building, User, MapPin, Users } from 'lucide-react'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'asha',
    district: '',
    taluk: '',
    phc: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Store user role and location data
    localStorage.setItem('userRole', formData.role)
    localStorage.setItem('userLocation', JSON.stringify({
      district: formData.district,
      taluk: formData.taluk,
      phc: formData.phc
    }))
    
    // Redirect based on role
    router.push(`/${formData.role}-dashboard`)
  }

  const roleOptions = [
    { value: 'asha', label: 'ASHA Worker', icon: User },
    { value: 'medical-officer', label: 'Medical Officer (PHC)', icon: Building },
    { value: 'taluk', label: 'Taluk Administrator', icon: MapPin },
    { value: 'district', label: 'District Administrator', icon: Users }
  ]

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
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                {roleOptions.map((role) => {
                  const Icon = role.icon
                  return (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Location Fields - Show based on role */}
            {formData.role !== 'asha' && (
              <>
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                    District
                  </label>
                  <select
                    id="district"
                    name="district"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                  >
                    <option value="">Select District</option>
                    <option value="district1">District 1</option>
                    <option value="district2">District 2</option>
                    <option value="district3">District 3</option>
                  </select>
                </div>

                {formData.role !== 'district' && (
                  <div>
                    <label htmlFor="taluk" className="block text-sm font-medium text-gray-700">
                      Taluk
                    </label>
                    <select
                      id="taluk"
                      name="taluk"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.taluk}
                      onChange={(e) => setFormData({...formData, taluk: e.target.value})}
                    >
                      <option value="">Select Taluk</option>
                      <option value="taluk1">Taluk 1</option>
                      <option value="taluk2">Taluk 2</option>
                      <option value="taluk3">Taluk 3</option>
                    </select>
                  </div>
                )}

                {formData.role === 'medical-officer' && (
                  <div>
                    <label htmlFor="phc" className="block text-sm font-medium text-gray-700">
                      PHC
                    </label>
                    <select
                      id="phc"
                      name="phc"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.phc}
                      onChange={(e) => setFormData({...formData, phc: e.target.value})}
                    >
                      <option value="">Select PHC</option>
                      <option value="phc1">PHC 1</option>
                      <option value="phc2">PHC 2</option>
                      <option value="phc3">PHC 3</option>
                    </select>
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
