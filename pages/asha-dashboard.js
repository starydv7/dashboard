import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { LineChartComponent, BarChartComponent, PieChartComponent } from '../components/Chart'
import GaugeChart from '../components/GaugeChart'
import { Home, Info, Search, MapPin, User, Target, TrendingUp, CheckCircle, LogOut } from 'lucide-react'
import { DashboardHeader } from '../components/Navigation'
import apiService from '../services/api'

export default function ASHADashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showDescription, setShowDescription] = useState(null)
  const [timeRange, setTimeRange] = useState('week')
  const [currentDate, setCurrentDate] = useState('')
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Access control: Only ASHA can access ASHA Dashboard
  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    if (userRole && userRole.toUpperCase() !== 'ASHA') {
      alert('Access Denied: Only ASHA users can access ASHA Dashboard')
      if (userRole.toUpperCase() === 'DLO') {
        router.push('/district-dashboard')
      } else if (userRole.toUpperCase() === 'PHC') {
        router.push('/taluk-dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [router])

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }))

    // Fetch API data when component mounts
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      console.log('🚀 Fetching ASHA Dashboard Data...')
      console.log('='.repeat(60))
      
      const data = await apiService.fetchAllAshaDashboardData()
      
      console.log('='.repeat(60))
      console.log('📊 FINAL DASHBOARD DATA:')
      console.log('Households Completed:', data.householdsCompleted)
      console.log('Households Sickness:', data.householdsSickness)
      console.log('Completed Courses:', data.completedCourses)
      console.log('Medicine Self:', data.medicineSelf)
      console.log('Want Info:', data.wantInfo)
      console.log('Symptom Categories:', data.symptomCategories)
      console.log('='.repeat(60))
      
      // Log symptoms data in detail for analysis
      if (data.symptomCategories) {
        console.log('🤒 SYMPTOMS DATA ANALYSIS:')
        console.log('Total symptoms:', data.symptomCategories.length || 'No data')
        console.log('Symptoms structure:', data.symptomCategories)
        console.log('='.repeat(40))
      }
      
      // Log weekly prescriptions data
      if (data.weeklyPrescriptions) {
        console.log('📋 WEEKLY PRESCRIPTIONS DATA:')
        console.log('Prescriptions structure:', data.weeklyPrescriptions)
        console.log('='.repeat(40))
      }
      
      setApiData(data)
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock ASHA data
  // Get user data from localStorage
  const getUserData = () => {
    if (typeof window !== 'undefined') {
      const userDataString = localStorage.getItem('userData')
      if (userDataString) {
        try {
          return JSON.parse(userDataString)
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }
    }
    return null
  }

  const userData = getUserData()

  const ashaData = {
    id: userData?.id || 'ASHA001',
    name: userData?.name || 'ASHA User',
    taluk: userData?.taluk || 'Dharwad',
    phc: userData?.phc || 'Dharwad PHC',
    villages: userData?.villages || ['Village A', 'Village B', 'Village C'],
    totalHouseholds: 150,
    assignedHouseholds: 150,
    completedHouseholds: 142,
    weeklyData: {
      householdsVisited: 45,
      averageTimePerHousehold: 12,
      individualsDataCollected: 89,
      prescriptionsScanned: 23,
      householdsWithSickness: 18,
      fullCourseCompleted: 15,
      antibioticsFromPharmacy: 8,
      wantToLearnMore: 12
    },
              symptomsData: [
        { name: 'Fever (>38.3°C or >101°F)', count: 35, percentage: 15.2 },
        { name: 'Chills and rigors', count: 28, percentage: 12.2 },
        { name: 'Headache', count: 25, percentage: 10.9 },
        { name: 'Retro-orbital pain', count: 18, percentage: 7.8 },
        { name: 'Severe malaise', count: 22, percentage: 9.6 },
        { name: 'Myalgia (muscle pain)', count: 20, percentage: 8.7 },
        { name: 'Joint pain (arthralgia)', count: 16, percentage: 7.0 },
        { name: 'Painful swallowing (odynophagia)', count: 12, percentage: 5.2 },
        { name: 'Sore throat', count: 15, percentage: 6.5 },
        { name: 'Tonsillar exudates', count: 8, percentage: 3.5 },
        { name: 'Palatal petechiae', count: 6, percentage: 2.6 },
        { name: 'Tender anterior cervical lymph nodes', count: 10, percentage: 4.3 },
        { name: 'Ear pain (otalgia)', count: 9, percentage: 3.9 },
        { name: 'Ear discharge (otorrhea)', count: 5, percentage: 2.2 },
        { name: 'Bulging, erythematous tympanic membrane', count: 4, percentage: 1.7 },
        { name: 'Facial pain', count: 7, percentage: 3.0 },
        { name: 'Purulent nasal discharge', count: 11, percentage: 4.8 },
        { name: 'Cough (with or without sputum)', count: 30, percentage: 13.0 },
        { name: 'Shortness of breath (dyspnea)', count: 8, percentage: 3.5 },
        { name: 'Pleuritic chest pain', count: 6, percentage: 2.6 },
        { name: 'New focal chest signs', count: 4, percentage: 1.7 },
        { name: 'Bloody diarrhea (dysentery)', count: 9, percentage: 3.9 },
        { name: 'Abdominal pain', count: 14, percentage: 6.1 },
        { name: 'Nausea or vomiting', count: 12, percentage: 5.2 },
        { name: 'Neck stiffness', count: 5, percentage: 2.2 },
        { name: 'Altered mental state or confusion', count: 3, percentage: 1.3 },
        { name: 'Systemic signs of severe infection', count: 4, percentage: 1.7 },
        { name: 'Others', count: 6, percentage: 2.6 }
      ]
  }

  const descriptions = {
    householdsVisited: "Total number of households visited by the ASHA in the selected time period.",
    averageTimeSpent: "Average time spent at each household visit. Indicates visit quality.",
    individualsDataCollected: "Total number of individuals whose data has been successfully reported.",
    completeness: "Percentage of assigned households covered. Shows progress towards coverage target.",
    symptomsCategory: "Distribution of symptoms reported by individuals.",
    prescriptionsScanned: "Total number of prescriptions scanned and uploaded.",
    householdsWithSickness: "Percentage of households with members currently sick or on treatment.",
    fullCourseCompleted: "Percentage of individuals who completed their full antibiotic course.",
    antibioticsFromPharmacy: "Percentage of people who got antibiotics without doctor prescription.",
    wantToLearnMore: "Percentage of individuals who want to learn more about antibiotic use."
  }


  const getCurrentData = () => {
    return timeRange === 'week' ? ashaData.weeklyData : ashaData.weeklyData
  }

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('userRole')
    localStorage.removeItem('userData')
    localStorage.removeItem('accessToken')
    
    // Redirect to login page
    router.push('/login')
  }

  // Get symptoms data from API or use hardcoded
  const getSymptomsData = () => {
    if (apiData && apiData.symptomCategories && apiData.symptomCategories.Data) {
      // Transform API data to match our chart format
      const symptomsArray = apiData.symptomCategories.Data.map(item => ({
        name: item.symptom,
        count: parseInt(item.symptom_count) || 0,
        percentage: 0 // We can calculate this if needed
      }))
      
      // Calculate total for percentages
      const totalCount = symptomsArray.reduce((sum, item) => sum + item.count, 0)
      
      // Add percentages
      return symptomsArray.map(item => ({
        ...item,
        percentage: totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : 0
      }))
    }
    
    // Fallback to hardcoded symptoms
    return ashaData.symptomsData
  }

  // Get real household data from API or use defaults
  const getHouseholdData = () => {
    // Use hardcoded values for total and assigned
    const totalHouseholds = ashaData.totalHouseholds
    const assignedHouseholds = ashaData.assignedHouseholds
    
    // Only completedHouseholds comes from API
    let completedHouseholds = ashaData.completedHouseholds
    let householdsWithSickness = getCurrentData().householdsWithSickness
    let fullCourseCompleted = getCurrentData().fullCourseCompleted
    let individualsDataCollected = getCurrentData().individualsDataCollected
    let antibioticsFromPharmacy = getCurrentData().antibioticsFromPharmacy
    let wantToLearnMore = getCurrentData().wantToLearnMore
    let prescriptionsScanned = getCurrentData().prescriptionsScanned
    
    if (apiData && apiData.householdsCompleted && apiData.householdsCompleted.success) {
      const householdVisited = parseInt(apiData.householdsCompleted.data.total_household_visited) || 0
      completedHouseholds = householdVisited
    }
    
    // Get households with sickness from API
    if (apiData && apiData.householdsSickness && apiData.householdsSickness.success) {
      const sicknessCount = parseInt(apiData.householdsSickness.data.total_household_with_sickness) || 0
      householdsWithSickness = sicknessCount
    }
    
    // Get completed courses from API
    if (apiData && apiData.completedCourses && apiData.completedCourses.success) {
      const completedCount = parseInt(apiData.completedCourses.data.total_individual_completed_course) || 0
      fullCourseCompleted = completedCount
    }
    
    // Get self-medication from API
    if (apiData && apiData.medicineSelf && apiData.medicineSelf.success) {
      const selfMedCount = parseInt(apiData.medicineSelf.data.total_self_medicine) || 0
      antibioticsFromPharmacy = selfMedCount
    }
    
    // Get want info from API
    if (apiData && apiData.wantInfo && apiData.wantInfo.success) {
      const wantInfoCount = parseInt(apiData.wantInfo.data.total_info_wants) || 0
      wantToLearnMore = wantInfoCount
    }
    
    // Get weekly prescriptions scanned from API
    if (apiData && apiData.weeklyPrescriptions && apiData.weeklyPrescriptions.success) {
      // Handle different possible data formats
      if (apiData.weeklyPrescriptions.data) {
        if (typeof apiData.weeklyPrescriptions.data.total_prescriptions_scanned !== 'undefined') {
          prescriptionsScanned = parseInt(apiData.weeklyPrescriptions.data.total_prescriptions_scanned) || 0
        } else if (typeof apiData.weeklyPrescriptions.data.total !== 'undefined') {
          prescriptionsScanned = parseInt(apiData.weeklyPrescriptions.data.total) || 0
        } else if (Array.isArray(apiData.weeklyPrescriptions.data)) {
          // If it's an array, sum up the values
          prescriptionsScanned = apiData.weeklyPrescriptions.data.reduce((sum, item) => sum + (parseInt(item.count) || 0), 0)
        }
      }
    }
    
    return {
      totalHouseholds: totalHouseholds,
      assignedHouseholds: assignedHouseholds,
      completedHouseholds: completedHouseholds,
      householdsVisited: completedHouseholds,
      householdsWithSickness: householdsWithSickness,
      fullCourseCompleted: fullCourseCompleted,
      individualsDataCollected: individualsDataCollected,
      antibioticsFromPharmacy: antibioticsFromPharmacy,
      wantToLearnMore: wantToLearnMore,
      prescriptionsScanned: prescriptionsScanned
    }
  }

  const householdData = getHouseholdData()
  const symptomsData = getSymptomsData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <DashboardHeader 
        title="ASHA Dashboard" 
        subtitle="Individual ASHA Performance & Community Health Metrics"
      />

      {/* ASHA Profile */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Welcome, {ashaData.name}!</h2>
                <p className="text-sm text-gray-600">
                  {ashaData.taluk} • {ashaData.phc} • {ashaData.villages.length} Villages
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{currentDate}</p>
              <p className="text-xs text-gray-400">ASHA Worker</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ASHA Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="metric-card">
            <div className="flex items-center">
              <Home className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Households</p>
                <p className="metric-value">{loading ? '...' : householdData.totalHouseholds}</p>
              </div>
            </div>
          </div>
          <div className="metric-card">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Households</p>
                <p className="metric-value">{loading ? '...' : householdData.assignedHouseholds}</p>
              </div>
            </div>
          </div>
          <div className="metric-card">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Households</p>
                <p className="metric-value">{loading ? '...' : householdData.completedHouseholds}</p>
              </div>
            </div>
          </div>
          <div className="metric-card">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Coverage Rate</p>
                <p className="metric-value">
                  {loading ? '...' : householdData.assignedHouseholds > 0 
                    ? `${((householdData.completedHouseholds / householdData.assignedHouseholds) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ASHA Level Indicators */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ASHA Level Indicators</h2>
          
          {/* Core Indicators - Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                         {/* 1. Households Visited */}
             <div className="card">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-gray-900">1. Households Visited</h3>
                 <div className="relative">
                   <button 
                     onMouseEnter={() => setShowDescription('householdsVisited')}
                     onMouseLeave={() => setShowDescription(null)}
                     className="text-gray-400 hover:text-gray-600"
                   >
                     <Info className="w-5 h-5" />
                   </button>
                   {showDescription === 'householdsVisited' && (
                     <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                       {descriptions.householdsVisited}
                     </div>
                   )}
                 </div>
               </div>
               <BarChartComponent 
                 data={[
                   { name: 'Visited This Week', value: householdData.householdsVisited, color: '#3b82f6' },
                   { name: 'Total Assigned', value: householdData.assignedHouseholds, color: '#6b7280' }
                 ]} 
                 dataKey="value" 
                 fill="#3b82f6"
               />
               <div className="text-center mt-2">
                 <span className="text-sm text-gray-600">
                   {loading ? 'Loading...' : `${householdData.householdsVisited} of ${householdData.assignedHouseholds} households`}
                 </span>
               </div>
             </div>

                         {/* 2. Average Time Spent */}
             <div className="card">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-gray-900">2. Average Time per Household</h3>
                 <div className="relative">
                   <button 
                     onMouseEnter={() => setShowDescription('averageTimeSpent')}
                     onMouseLeave={() => setShowDescription(null)}
                     className="text-gray-400 hover:text-gray-600"
                   >
                     <Info className="w-5 h-5" />
                   </button>
                   {showDescription === 'averageTimeSpent' && (
                     <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                       {descriptions.averageTimeSpent}
                     </div>
                   )}
                 </div>
               </div>
               <LineChartComponent 
                 data={[
                   { month: 'Mon', value: 10 },
                   { month: 'Tue', value: 12 },
                   { month: 'Wed', value: 15 },
                   { month: 'Thu', value: 11 },
                   { month: 'Fri', value: 13 },
                   { month: 'Sat', value: 14 }
                 ]} 
                 dataKey="value" 
                 fill="#10b981"
               />
               <div className="text-center mt-2">
                 <span className="text-sm text-gray-600">
                   Average: {getCurrentData().averageTimePerHousehold} minutes per household
                 </span>
               </div>
             </div>
          </div>

          {/* Core Indicators - Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                         {/* 3. Individuals Data Collected */}
             <div className="card">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-gray-900">3. Individuals Data Collected</h3>
                 <div className="relative">
                   <button 
                     onMouseEnter={() => setShowDescription('individualsDataCollected')}
                     onMouseLeave={() => setShowDescription(null)}
                     className="text-gray-400 hover:text-gray-600"
                   >
                     <Info className="w-5 h-5" />
                   </button>
                   {showDescription === 'individualsDataCollected' && (
                     <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                       {descriptions.individualsDataCollected}
                     </div>
                   )}
                 </div>
               </div>
                               <BarChartComponent 
                  data={[
                    { name: 'Individuals Data Collected', value: getCurrentData().individualsDataCollected, color: '#8b5cf6' }
                  ]} 
                  dataKey="value" 
                  fill="#8b5cf6"
                />
               <div className="text-center mt-2">
                 <span className="text-sm text-gray-600">
                   {getCurrentData().individualsDataCollected} individuals reported this week
                 </span>
               </div>
             </div>

            {/* 4. Completeness */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">4. Completeness</h3>
                <div className="relative">
                  <button 
                    onMouseEnter={() => setShowDescription('completeness')}
                    onMouseLeave={() => setShowDescription(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  {showDescription === 'completeness' && (
                    <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                      {descriptions.completeness}
                    </div>
                  )}
                </div>
              </div>
              <BarChartComponent 
                data={[
                  { name: 'Completed', value: householdData.completedHouseholds, color: '#10b981' },
                  { name: 'Remaining', value: householdData.assignedHouseholds - householdData.completedHouseholds, color: '#e5e7eb' }
                ]} 
                dataKey="value" 
                fill="#10b981"
              />
              <div className="text-center mt-2">
                <span className="text-sm text-gray-600">
                  {loading ? 'Loading...' : householdData.assignedHouseholds > 0 
                    ? `${((householdData.completedHouseholds / householdData.assignedHouseholds) * 100).toFixed(1)}% coverage achieved`
                    : '0% coverage achieved'}
                </span>
              </div>
            </div>
          </div>

          {/* Core Indicators - Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 5. Symptoms Category */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">5. Symptoms Category</h3>
                <div className="relative">
                  <button 
                    onMouseEnter={() => setShowDescription('symptomsCategory')}
                    onMouseLeave={() => setShowDescription(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  {showDescription === 'symptomsCategory' && (
                    <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                      {descriptions.symptomsCategory}
                    </div>
                  )}
                </div>
              </div>
                                                           <BarChartComponent 
                 data={symptomsData.map(symptom => ({
                   name: symptom.name,
                   value: symptom.count,
                   color: symptom.name === 'Fever (>38.3°C or >101°F)' ? '#ef4444' : 
                          symptom.name === 'Chills and rigors' ? '#f97316' : 
                          symptom.name === 'Headache' ? '#8b5cf6' : 
                          symptom.name === 'Retro-orbital pain' ? '#a855f7' : 
                          symptom.name === 'Severe malaise' ? '#dc2626' : 
                          symptom.name === 'Myalgia (muscle pain)' ? '#06b6d4' : 
                          symptom.name === 'Joint pain (arthralgia)' ? '#f59e0b' : 
                          symptom.name === 'Painful swallowing (odynophagia)' ? '#ec4899' : 
                          symptom.name === 'Sore throat' ? '#f43f5e' : 
                          symptom.name === 'Tonsillar exudates' ? '#be185d' : 
                          symptom.name === 'Palatal petechiae' ? '#7c3aed' : 
                          symptom.name === 'Tender anterior cervical lymph nodes' ? '#059669' : 
                          symptom.name === 'Ear pain (otalgia)' ? '#0ea5e9' : 
                          symptom.name === 'Ear discharge (otorrhea)' ? '#0891b2' : 
                          symptom.name === 'Bulging, erythematous tympanic membrane' ? '#0369a1' : 
                          symptom.name === 'Facial pain' ? '#7c2d12' : 
                          symptom.name === 'Purulent nasal discharge' ? '#65a30d' : 
                          symptom.name === 'Cough (with or without sputum)' ? '#ca8a04' : 
                          symptom.name === 'Shortness of breath (dyspnea)' ? '#dc2626' : 
                          symptom.name === 'Pleuritic chest pain' ? '#b91c1c' : 
                          symptom.name === 'New focal chest signs' ? '#991b1b' : 
                          symptom.name === 'Bloody diarrhea (dysentery)' ? '#15803d' : 
                          symptom.name === 'Abdominal pain' ? '#16a34a' : 
                          symptom.name === 'Nausea or vomiting' ? '#22c55e' : 
                          symptom.name === 'Neck stiffness' ? '#84cc16' : 
                          symptom.name === 'Altered mental state or confusion' ? '#eab308' : 
                          symptom.name === 'Systemic signs of severe infection' ? '#f59e0b' : 
                          '#6b7280'
                 }))} 
                 dataKey="value" 
                 fill="#ef4444"
               />
               <div className="text-center mt-2">
                 <span className="text-sm text-gray-600">
                   {loading ? 'Loading...' : `Total: ${symptomsData.reduce((sum, symptom) => sum + symptom.count, 0)} cases reported`}
                 </span>
               </div>
            </div>

                         {/* 6. Prescriptions Scanned */}
             <div className="card">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-gray-900">6. Prescriptions Scanned</h3>
                 <div className="relative">
                   <button 
                     onMouseEnter={() => setShowDescription('prescriptionsScanned')}
                     onMouseLeave={() => setShowDescription(null)}
                     className="text-gray-400 hover:text-gray-600"
                   >
                     <Info className="w-5 h-5" />
                   </button>
                   {showDescription === 'prescriptionsScanned' && (
                     <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                       {descriptions.prescriptionsScanned}
                     </div>
                   )}
                 </div>
               </div>
               <LineChartComponent 
                 data={[
                   { month: 'Mon', value: 3 },
                   { month: 'Tue', value: 5 },
                   { month: 'Wed', value: 4 },
                   { month: 'Thu', value: 6 },
                   { month: 'Fri', value: 3 },
                   { month: 'Sat', value: 2 }
                 ]} 
                 dataKey="value" 
                 fill="#6366f1"
               />
               <div className="text-center mt-2">
                 <span className="text-sm text-gray-600">
                   {loading ? 'Loading...' : `${householdData.prescriptionsScanned} prescriptions uploaded this week`}
                 </span>
               </div>
             </div>
          </div>

          {/* Core Indicators - Row 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 7. Households with Sickness */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">7. Households with Sickness/Treatment</h3>
                <div className="relative">
                  <button 
                    onMouseEnter={() => setShowDescription('householdsWithSickness')}
                    onMouseLeave={() => setShowDescription(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  {showDescription === 'householdsWithSickness' && (
                    <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                      {descriptions.householdsWithSickness}
                    </div>
                  )}
                </div>
              </div>
              <BarChartComponent 
                data={[
                  { name: 'With Sickness', value: householdData.householdsWithSickness, color: '#ef4444' },
                  { name: 'Total Visited', value: householdData.householdsVisited, color: '#3b82f6' }
                ]} 
                dataKey="value" 
                fill="#ef4444"
              />
              <div className="text-center mt-2">
                <span className="text-sm text-gray-600">
                  {loading ? 'Loading...' : householdData.householdsVisited > 0 
                    ? `${((householdData.householdsWithSickness / householdData.householdsVisited) * 100).toFixed(1)}% of visited households`
                    : '0% of visited households'}
                </span>
              </div>
            </div>

            {/* 8. Full Course Completion */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">8. Full Course Completion</h3>
                <div className="relative">
                  <button 
                    onMouseEnter={() => setShowDescription('fullCourseCompleted')}
                    onMouseLeave={() => setShowDescription(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  {showDescription === 'fullCourseCompleted' && (
                    <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                      {descriptions.fullCourseCompleted}
                    </div>
                  )}
                </div>
              </div>
              <BarChartComponent 
                data={[
                  { name: 'Completed Course', value: householdData.fullCourseCompleted, color: '#10b981' },
                  { name: 'Total Individuals', value: householdData.individualsDataCollected, color: '#3b82f6' }
                ]} 
                dataKey="value" 
                fill="#10b981"
              />
              <div className="text-center mt-2">
                <span className="text-sm text-gray-600">
                  {loading ? 'Loading...' : householdData.individualsDataCollected > 0 
                    ? `${((householdData.fullCourseCompleted / householdData.individualsDataCollected) * 100).toFixed(1)}% completion rate`
                    : '0% completion rate'}
                </span>
              </div>
            </div>
          </div>

          {/* Core Indicators - Row 5 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 9. Antibiotics from Pharmacy/Self */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">9. Antibiotics from Pharmacy/Self</h3>
                <div className="relative">
                  <button 
                    onMouseEnter={() => setShowDescription('antibioticsFromPharmacy')}
                    onMouseLeave={() => setShowDescription(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  {showDescription === 'antibioticsFromPharmacy' && (
                    <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                      {descriptions.antibioticsFromPharmacy}
                    </div>
                  )}
                </div>
              </div>
              <BarChartComponent 
                data={[
                  { name: 'From Pharmacy/Self', value: householdData.antibioticsFromPharmacy, color: '#ef4444' },
                  { name: 'Total Individuals', value: householdData.individualsDataCollected, color: '#3b82f6' }
                ]} 
                dataKey="value" 
                fill="#ef4444"
              />
              <div className="text-center mt-2">
                <span className="text-sm text-gray-600">
                  {loading ? 'Loading...' : householdData.individualsDataCollected > 0 
                    ? `${((householdData.antibioticsFromPharmacy / householdData.individualsDataCollected) * 100).toFixed(1)}% without prescription`
                    : '0% without prescription'}
                </span>
              </div>
            </div>

            {/* 10. Want to Learn More */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">10. Want to Learn More</h3>
                <div className="relative">
                  <button 
                    onMouseEnter={() => setShowDescription('wantToLearnMore')}
                    onMouseLeave={() => setShowDescription(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  {showDescription === 'wantToLearnMore' && (
                    <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                      {descriptions.wantToLearnMore}
                    </div>
                  )}
                </div>
              </div>
              <BarChartComponent 
                data={[
                  { name: 'Want to Learn', value: householdData.wantToLearnMore, color: '#10b981' },
                  { name: 'Total Individuals', value: householdData.individualsDataCollected, color: '#3b82f6' }
                ]} 
                dataKey="value" 
                fill="#10b981"
              />
              <div className="text-center mt-2">
                <span className="text-sm text-gray-600">
                  {loading ? 'Loading...' : householdData.individualsDataCollected > 0 
                    ? `${((householdData.wantToLearnMore / householdData.individualsDataCollected) * 100).toFixed(1)}% IEC opportunity`
                    : '0% IEC opportunity'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Village Coverage Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Village Coverage Details</h2>
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ashaData.villages.map((village, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-gray-900">{village}</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Households:</span>
                      <span className="font-medium">~{Math.floor(ashaData.totalHouseholds / ashaData.villages.length)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coverage:</span>
                      <span className="font-medium text-green-600">95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Visit:</span>
                      <span className="font-medium">2 days ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mb-8">
          <div className="card">
            <div className="flex flex-col items-center justify-center py-6">
              <p className="text-gray-600 mb-4">Ready to end your session?</p>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
