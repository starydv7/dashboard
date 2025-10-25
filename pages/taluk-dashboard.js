import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { dharwadData, getTalukData, getAllTaluks } from '../data/dharwadData'
import { healthcareData } from '../data/healthcareData'
import { LineChartComponent, BarChartComponent, PieChartComponent } from '../components/Chart'
import GaugeChart from '../components/GaugeChart'
import { 
  EpidemiologicalTrendChart, 
  HealthcarePerformanceChart, 
  RiskAssessmentChart, 
  PopulationHealthChart, 
  HealthcareAccessChart, 
  TreatmentComplianceChart, 
  SeasonalHealthChart, 
  InfrastructureChart 
} from '../components/HealthcareCharts'
import { Calendar, Users, Home, Activity, Info, Search, Filter, MapPin, Building, User, ChevronDown, ChevronRight, LogOut } from 'lucide-react'
import { DashboardHeader } from '../components/Navigation'

export default function TalukDashboard() {
  const [selectedTaluk, setSelectedTaluk] = useState('')
  const [selectedPHC, setSelectedPHC] = useState('')
  const [selectedASHA, setSelectedASHA] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDescription, setShowDescription] = useState(null)
  const [expandedPHCs, setExpandedPHCs] = useState({})
  const [expandedASHAs, setExpandedASHAs] = useState({})
  const router = useRouter()

  // Access control: Only PHC can access Taluk Dashboard
  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    if (userRole && userRole.toUpperCase() !== 'PHC') {
      alert('Access Denied: Only PHC users can access Taluk Dashboard')
      if (userRole.toUpperCase() === 'ASHA') {
        router.push('/asha-dashboard')
      } else if (userRole.toUpperCase() === 'DLO') {
        router.push('/district-dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [router])

  const talukData = selectedTaluk ? getTalukData(selectedTaluk) : null
  const allTaluks = getAllTaluks()

  const descriptions = {
    antibioticUsage: "Share of patients on medicines who are using antibiotics across the taluk.",
    selfMedication: "Share of patients who are self-medicating across the taluk.",
    awareness: "Share of patients who are aware of antibiotic resistance across the taluk.",
    symptomsCategory: "Distribution of symptoms reported by patients across the taluk.",
    healthInfoSource: "Sources of health information used by patients across the taluk."
  }

  const togglePHC = (phcName) => {
    setExpandedPHCs(prev => ({
      ...prev,
      [phcName]: !prev[phcName]
    }))
  }

  const toggleASHA = (ashaName) => {
    setExpandedASHAs(prev => ({
      ...prev,
      [ashaName]: !prev[ashaName]
    }))
  }

  const filteredTaluks = allTaluks.filter(taluk => 
    taluk.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userData')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <DashboardHeader 
        title="Taluk Dashboard" 
        subtitle="Taluk-level health metrics and PHC data"
      />

      {/* Taluk Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 min-w-0">
              <label htmlFor="taluk-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Taluk
              </label>
              <div className="relative">
              <select
                  id="taluk-select"
                value={selectedTaluk}
                  onChange={(e) => setSelectedTaluk(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
                  style={{ appearance: 'none', WebkitAppearance: 'none' }}
                >
                  <option value="">Choose a taluk...</option>
                  {filteredTaluks.map((taluk) => (
                    <option key={taluk.id} value={taluk.name}>
                      {taluk.name}
                  </option>
                ))}
              </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {/* Custom dropdown icon on left */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Taluks
              </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              <input
                  id="search"
                type="text"
                  placeholder="Search taluks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {!selectedTaluk ? (
          // Taluk Selection View
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Select a Taluk</h3>
            <p className="mt-1 text-sm text-gray-500">
              Choose a taluk from the dropdown above to view detailed information
            </p>
          </div>
        ) : (
          <>
            {/* Taluk Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Population
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {talukData?.totalIndividuals?.toLocaleString() || 'N/A'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        PHCs
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {talukData?.phcs?.length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        ASHA Workers
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {talukData?.ashas?.length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Health Score
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {talukData?.healthScore ? `${talukData.healthScore}%` : 'N/A'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Taluk Level Indicators */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Core Taluk Level Indicators</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
                {/* Antibiotic Usage */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Antibiotic Usage</h3>
                    <div className="relative">
                      <button 
                        onMouseEnter={() => setShowDescription('antibioticUsage')}
                        onMouseLeave={() => setShowDescription(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                      {showDescription === 'antibioticUsage' && (
                        <div className="absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                          {descriptions.antibioticUsage}
                        </div>
                      )}
                    </div>
                  </div>
                  <GaugeChart 
                    value={talukData?.antibioticUsage || 0} 
                    max={100}
                    color="#ef4444"
                    label="%"
                  />
                </div>

                {/* Self Medication */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                   <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Self Medication</h3>
                     <div className="relative">
                       <button 
                         onMouseEnter={() => setShowDescription('selfMedication')}
                         onMouseLeave={() => setShowDescription(null)}
                         className="text-gray-400 hover:text-gray-600"
                       >
                         <Info className="w-5 h-5" />
                       </button>
                       {showDescription === 'selfMedication' && (
                        <div className="absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                           {descriptions.selfMedication}
                         </div>
                       )}
                     </div>
                   </div>
                  <GaugeChart 
                    value={talukData?.selfMedication || 0} 
                    max={100}
                    color="#f59e0b"
                    label="%"
                  />
                </div>

                {/* Awareness */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Awareness</h3>
                    <div className="relative">
                      <button 
                        onMouseEnter={() => setShowDescription('awareness')}
                        onMouseLeave={() => setShowDescription(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                      {showDescription === 'awareness' && (
                        <div className="absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                          {descriptions.awareness}
                        </div>
                      )}
                    </div>
                  </div>
                  <GaugeChart 
                    value={talukData?.awareness || 0} 
                    max={100}
                    color="#10b981"
                    label="%"
                  />
                </div>
              </div>
            </div>

            {/* Symptoms Category for Taluk */}
              <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Symptoms Distribution in {talukData?.name || 'Selected Taluk'}</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Symptoms Category</h3>
                      <div className="relative">
                        <button 
                      onMouseEnter={() => setShowDescription('symptomsCategory')}
                          onMouseLeave={() => setShowDescription(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                    {showDescription === 'symptomsCategory' && (
                      <div className="absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                        {descriptions.symptomsCategory}
                          </div>
                        )}
                      </div>
                    </div>
                <PieChartComponent 
                  data={talukData?.symptomsCategory?.map(symptom => ({
                    name: symptom.symptom,
                    value: symptom.percentage,
                    color: symptom.color
                  })) || []} 
                      dataKey="value" 
                  fill="#ef4444"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                    Total: {talukData?.totalIndividuals?.toLocaleString() || 'N/A'} individuals surveyed
                      </span>
                    </div>
                  </div>
                </div>

            {/* Health Information Sources */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Health Information Sources in {talukData?.name || 'Selected Taluk'}</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Health Info Sources</h3>
                      <div className="relative">
                        <button 
                      onMouseEnter={() => setShowDescription('healthInfoSource')}
                          onMouseLeave={() => setShowDescription(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                    {showDescription === 'healthInfoSource' && (
                      <div className="absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                        {descriptions.healthInfoSource}
                          </div>
                        )}
                      </div>
                    </div>
                    <BarChartComponent 
                  data={talukData?.healthInfoSources?.map(source => ({
                    name: source.source,
                    value: source.percentage,
                    color: source.color
                  })) || []} 
                      dataKey="value" 
                      fill="#3b82f6"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                    Total: {talukData?.totalIndividuals?.toLocaleString() || 'N/A'} individuals surveyed
                      </span>
                    </div>
                  </div>
                </div>

            {/* PHCs in Taluk */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">PHCs in {talukData?.name || 'Selected Taluk'}</h2>
              <div className="space-y-4">
                {talukData?.phcs?.map((phc) => (
                  <div key={phc.name} className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <button 
                      onClick={() => togglePHC(phc.name)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <div className="flex items-center space-x-3">
                        <Building className="h-6 w-6 text-green-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{phc.name}</h3>
                          <p className="text-sm text-gray-500">
                            Population: {phc.totalIndividuals?.toLocaleString() || 'N/A'} | 
                            Health Score: {phc.healthScore ? `${phc.healthScore}%` : 'N/A'}
                          </p>
                          </div>
                      </div>
                      {expandedPHCs[phc.name] ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedPHCs[phc.name] && (
                      <div className="px-6 pb-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Antibiotic Usage</h4>
                            <div className="text-2xl font-bold text-red-600">
                              {phc.antibioticUsage ? `${phc.antibioticUsage}%` : 'N/A'}
                  </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Self Medication</h4>
                            <div className="text-2xl font-bold text-yellow-600">
                              {phc.selfMedication ? `${phc.selfMedication}%` : 'N/A'}
                      </div>
                    </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Awareness</h4>
                            <div className="text-2xl font-bold text-green-600">
                              {phc.awareness ? `${phc.awareness}%` : 'N/A'}
                    </div>
                  </div>
                </div>

                        {/* ASHAs in this PHC */}
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-900 mb-3">ASHAs in {phc.name}</h4>
                          <div className="space-y-2">
                            {phc.ashas?.map((asha) => (
                              <div key={asha.name} className="bg-white border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium text-gray-900">{asha.name}</span>
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    Score: {asha.healthScore ? `${asha.healthScore}%` : 'N/A'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Healthcare Charts Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Healthcare Analytics for {talukData?.name || 'Selected Taluk'}</h2>
              
              {/* Epidemiological Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Epidemiological Trends</h3>
                  <EpidemiologicalTrendChart data={healthcareData.epidemiologicalTrends} />
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Healthcare Performance</h3>
                  <HealthcarePerformanceChart data={healthcareData.healthcarePerformance} />
                </div>
              </div>

              {/* Risk Assessment and Population Health */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                  <RiskAssessmentChart data={healthcareData.riskAssessment} />
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Population Health</h3>
                  <PopulationHealthChart data={healthcareData.populationHealth} />
                    </div>
                  </div>

              {/* Healthcare Access and Treatment Compliance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Healthcare Access</h3>
                  <HealthcareAccessChart data={healthcareData.healthcareAccess} />
                          </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Compliance</h3>
                  <TreatmentComplianceChart data={healthcareData.treatmentCompliance} />
                      </div>
                    </div>

              {/* Seasonal Health and Infrastructure */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Health Patterns</h3>
                  <SeasonalHealthChart data={healthcareData.seasonalHealth} />
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Infrastructure Status</h3>
                  <InfrastructureChart data={healthcareData.infrastructure} />
                          </div>
                      </div>
                    </div>

            {/* Summary Statistics */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Summary Statistics for {talukData?.name || 'Selected Taluk'}</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {talukData?.antibioticUsage ? `${talukData.antibioticUsage}%` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">Antibiotic Usage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {talukData?.selfMedication ? `${talukData.selfMedication}%` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">Self Medication</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {talukData?.awareness ? `${talukData.awareness}%` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">Awareness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {talukData?.totalIndividuals?.toLocaleString() || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">Total Population</div>
                   </div>
                 </div>
               </div>
             </div>
           </>
        )}

        {/* Logout Button */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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