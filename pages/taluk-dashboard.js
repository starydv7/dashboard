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
import { Calendar, Users, Home, Activity, Info, Search, Filter, LogOut, MapPin, Building, User, ChevronDown, ChevronRight } from 'lucide-react'

export default function TalukDashboard() {
  const [selectedTaluk, setSelectedTaluk] = useState('')
  const [selectedPHC, setSelectedPHC] = useState('')
  const [selectedASHA, setSelectedASHA] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDescription, setShowDescription] = useState(null)
  const [expandedPHCs, setExpandedPHCs] = useState({})
  const [expandedASHAs, setExpandedASHAs] = useState({})
  const router = useRouter()

  const talukData = selectedTaluk ? getTalukData(selectedTaluk) : null
  const allTaluks = getAllTaluks()

  const descriptions = {
    // Core Taluk Level Indicators (1-5)
    antibioticUsage: "Share of patients on medicines who are using antibiotics across the taluk. Formula: (Number of individuals who took antibiotics / Total number of Individuals who took any medicine) * 100. Source: Q10",
    selfMedication: "How many people use antibiotics without visiting a doctor. Formula: (Antibiotic users who did not consult a doctor / Total Number of Antibiotic Users) * 100. Source: Q19, Q31",
    prescriptionAvailability: "How often antibiotics are backed by a prescription. Formula: (Antibiotic users with prescription / Total Number of Antibiotic users) * 100. Source: Q20",
    completionRate: "Whether people are completing the full antibiotic course. Formula: (Antibiotic users who completed full course / Total Antibiotic Users) * 100. Source: Q21",
    restartWithoutConsultation: "How often people restart antibiotics without medical advice. Formula: (Individuals who restarted antibiotics without consultation / Total Antibiotic users) * 100. Source: Q22",
    
    // Additional Taluk Level Indicators (6-11)
    healthFacilityPreference: "Where people prefer to go for care in the taluk. Formula: (Respondents preferring government health centers/Total Respondents) * 100. Source: Q28",
    awareness: "How much people know about the risks of antibiotic misuse. Formula: (Individuals aware of consequences of Misuse/Total Respondents) * 100. Source: Q24, Q25",
    barriersToHealthLiteracy: "Common reasons why people find it hard to get or understand health information. Frequency of reported responses. Source: Q38",
    avgDistanceToPharmacy: "How far people need to travel to get medicines. Frequency of reported responses. Source: Q36",
    longTermIllnessPrevalence: "Burden of chronic diseases in the taluk. Formula: (Individuals with chronic illness/Total Respondents) * 100. Source: Q15",
    sourceOfHealthInformation: "Common ways people get their health information (e.g., doctor, ASHA, media). Frequency of reported responses. Source: Q34",
    
    // ASHA Level Indicators
    householdsVisited: "Total number of households visited by ASHAs in this taluk in the selected time period.",
    averageTimeSpent: "Average time spent at each household visit by ASHAs. Indicates visit quality.",
    individualsDataCollected: "Total number of individuals whose data has been successfully reported using the AMRSense platform.",
    completeness: "Percentage of assigned households covered. Shows progress towards coverage target.",
    symptomsCategory: "Distribution of symptoms reported by individuals in this taluk.",
    prescriptionsScanned: "Total number of prescriptions scanned and uploaded by ASHAs.",
    householdsWithSickness: "Percentage of households with members currently sick or on treatment.",
    fullCourseCompleted: "Percentage of individuals who completed their full antibiotic course.",
    antibioticsFromPharmacy: "Percentage of people who got antibiotics without doctor prescription.",
    wantToLearnMore: "Percentage of individuals who want to learn more about antibiotic use."
  }

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userLocation')
    router.push('/login')
  }

  const togglePHCExpansion = (phcId) => {
    setExpandedPHCs(prev => ({
      ...prev,
      [phcId]: !prev[phcId]
    }))
  }

  const toggleASHAExpansion = (ashaId) => {
    setExpandedASHAs(prev => ({
      ...prev,
      [ashaId]: !prev[ashaId]
    }))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Taluk Level Dashboard</h1>
              <p className="text-sm text-gray-600">Dharwad District - Taluk-wise Analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {formatDate(new Date())}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Taluk Selection */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Taluk Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Taluk
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={selectedTaluk}
                onChange={(e) => {
                  setSelectedTaluk(e.target.value)
                  setSelectedPHC('')
                  setSelectedASHA('')
                }}
              >
                <option value="">Choose a Taluk</option>
                {allTaluks.map(taluk => (
                  <option key={taluk.id} value={taluk.id}>
                    {taluk.name} ({taluk.phcCount} PHCs, {taluk.ashaCount} ASHAs)
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by PHC, ASHA, Village..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Button */}
            <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </button>
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
          // Selected Taluk View
          <>
            {/* Taluk Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="metric-card">
                <div className="flex items-center">
                  <MapPin className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Selected Taluk</p>
                    <p className="metric-value">{talukData.name}</p>
                  </div>
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center">
                  <Building className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total PHCs</p>
                    <p className="metric-value">{talukData.phcCount}</p>
                  </div>
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total ASHAs</p>
                    <p className="metric-value">{talukData.ashaCount}</p>
                  </div>
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center">
                  <Home className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Households</p>
                    <p className="metric-value">{talukData.households.toLocaleString('en-US')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Performance Indicators (1-2) */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Core Performance Indicators (1-2)</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">1. Antibiotic Usage Prevalence</h3>
                    <div className="relative">
                      <button 
                        onMouseEnter={() => setShowDescription('antibioticUsage')}
                        onMouseLeave={() => setShowDescription(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                      {showDescription === 'antibioticUsage' && (
                        <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                          {descriptions.antibioticUsage}
                        </div>
                      )}
                    </div>
                  </div>
                  <BarChartComponent 
                    data={[
                      { name: 'Antibiotic Usage', value: dharwadData.performanceData.taluk[selectedTaluk]?.antibioticUsage || 0 }
                    ]} 
                    dataKey="value" 
                    fill="#3b82f6"
                  />
                </div>

                                 <div className="card">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-semibold text-gray-900">2. Self-Medication Rate</h3>
                     <div className="relative">
                       <button 
                         onMouseEnter={() => setShowDescription('selfMedication')}
                         onMouseLeave={() => setShowDescription(null)}
                         className="text-gray-400 hover:text-gray-600"
                       >
                         <Info className="w-5 h-5" />
                       </button>
                       {showDescription === 'selfMedication' && (
                         <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                           {descriptions.selfMedication}
                         </div>
                       )}
                     </div>
                   </div>
                   <BarChartComponent 
                     data={[
                       { name: 'Without Consultation', value: dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.selfMedication?.withoutDoctor || 0, color: '#ef4444' },
                       { name: 'Total Antibiotic Users', value: dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.selfMedication?.totalAntibioticUsers || 0, color: '#f59e0b' }
                     ]} 
                     dataKey="value" 
                     fill="#ef4444"
                   />
                 </div>
              </div>
            </div>

            {/* PHC and ASHA Details */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">PHC and ASHA Details</h2>
              
              <div className="space-y-4">
                {talukData.phcs.map((phc) => (
                  <div key={phc.id} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Building className="w-6 h-6 text-blue-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{phc.name}</h3>
                          <p className="text-sm text-gray-600">
                            {phc.ashaCount} ASHAs • {phc.households.toLocaleString('en-US')} Households
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => togglePHCExpansion(phc.id)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        {expandedPHCs[phc.id] ? (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            <span>Collapse</span>
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-4 h-4" />
                            <span>Expand</span>
                          </>
                        )}
                      </button>
                    </div>

                    {expandedPHCs[phc.id] && (
                      <div className="mt-4 pl-10">
                        <h4 className="text-md font-medium text-gray-900 mb-3">ASHAs under {phc.name}:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {phc.ashas.map((asha) => (
                            <div key={asha.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <User className="w-5 h-5 text-green-600" />
                                  <h5 className="font-medium text-gray-900">{asha.name}</h5>
                                </div>
                                <button
                                  onClick={() => toggleASHAExpansion(asha.id)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  {expandedASHAs[asha.id] ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              <p className="text-sm text-gray-600">
                                {asha.households} Households • {asha.villages.join(', ')}
                              </p>
                              
                              {expandedASHAs[asha.id] && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="text-gray-600">Villages:</span>
                                      <p className="font-medium">{asha.villages.join(', ')}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Households:</span>
                                      <p className="font-medium">{asha.households}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">PHC:</span>
                                      <p className="font-medium">{phc.name}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Taluk:</span>
                                      <p className="font-medium">{talukData.name}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Taluk Summary Statistics */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Taluk Summary</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Population Distribution</h3>
                  <PieChartComponent 
                    data={healthcareData.populationDistribution} 
                  />
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Healthcare Infrastructure</h3>
                  <InfrastructureChart 
                    data={[
                      { 
                        taluk: talukData.name, 
                        phc: talukData.phcCount, 
                        subcenter: talukData.phcCount * 3, 
                        asha: talukData.ashaCount 
                      }
                    ]} 
                    title=""
                  />
                </div>
              </div>

              {/* Additional Taluk Level Indicators */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Awareness Level</h3>
                    <div className="relative">
                      <button 
                        onMouseEnter={() => setShowDescription('awareness')}
                        onMouseLeave={() => setShowDescription(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                      {showDescription === 'awareness' && (
                        <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                          {descriptions.awareness}
                        </div>
                      )}
                    </div>
                  </div>
                  <BarChartComponent 
                    data={[
                      { name: 'Aware of Misuse Risks', value: healthcareData.coreIndicators.antibioticMisuseAwareness.talukWise[talukData.name] || 0, color: '#10b981' },
                      { name: 'Not Aware', value: 100 - (healthcareData.coreIndicators.antibioticMisuseAwareness.talukWise[talukData.name] || 0), color: '#ef4444' }
                    ]} 
                    dataKey="value" 
                    fill="#10b981"
                  />
                  <div className="text-center mt-2">
                    <span className="text-sm text-gray-600">
                      {healthcareData.coreIndicators.antibioticMisuseAwareness.talukWise[talukData.name] || 0}% aware of antibiotic misuse risks
                    </span>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Course Completion Rate</h3>
                    <div className="relative">
                      <button 
                        onMouseEnter={() => setShowDescription('completionRate')}
                        onMouseLeave={() => setShowDescription(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                      {showDescription === 'completionRate' && (
                        <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                          {descriptions.completionRate}
                        </div>
                      )}
                    </div>
                  </div>
                  <BarChartComponent 
                    data={[
                      { name: 'Completed Full Course', value: dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.completionData?.completedCourse || 0, color: '#10b981' },
                      { name: 'Did Not Complete', value: (dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.completionData?.totalAntibioticUsers || 0) - (dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.completionData?.completedCourse || 0), color: '#ef4444' }
                    ]} 
                    dataKey="value" 
                    fill="#10b981"
                  />
                  <div className="text-center mt-2">
                    <span className="text-sm text-gray-600">
                      {Math.round(((dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.completionData?.completedCourse || 0) / (dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.completionData?.totalAntibioticUsers || 1)) * 100)}% completed full course
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Core Taluk Indicators */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Core Taluk Indicators</h2>
                
                {/* Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">3. Prescription Availability Rate</h3>
                      <div className="relative">
                        <button 
                          onMouseEnter={() => setShowDescription('prescriptionAvailability')}
                          onMouseLeave={() => setShowDescription(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        {showDescription === 'prescriptionAvailability' && (
                          <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                            {descriptions.prescriptionAvailability}
                          </div>
                        )}
                      </div>
                    </div>
                    <BarChartComponent 
                      data={[
                        { name: 'With Prescription', value: dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.prescriptionData?.withPrescription || 0, color: '#10b981' },
                        { name: 'Without Prescription', value: (dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.prescriptionData?.totalAntibioticUsers || 0) - (dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.prescriptionData?.withPrescription || 0), color: '#ef4444' }
                      ]} 
                      dataKey="value" 
                      fill="#10b981"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                        {Math.round(((dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.prescriptionData?.withPrescription || 0) / (dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.prescriptionData?.totalAntibioticUsers || 1)) * 100)}% with prescription
                      </span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">5. Restart Without Consultation</h3>
                      <div className="relative">
                        <button 
                          onMouseEnter={() => setShowDescription('restartWithoutConsultation')}
                          onMouseLeave={() => setShowDescription(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        {showDescription === 'restartWithoutConsultation' && (
                          <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                            {descriptions.restartWithoutConsultation}
                          </div>
                        )}
                      </div>
                    </div>
                    <BarChartComponent 
                      data={[
                        { name: 'Restarted Without Consultation', value: dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.restartData?.restartedWithoutConsultation || 0, color: '#f59e0b' },
                        { name: 'Total Antibiotic Users', value: dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.restartData?.totalAntibioticUsers || 0, color: '#6b7280' }
                      ]} 
                      dataKey="value" 
                      fill="#f59e0b"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                        {Math.round(((dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.restartData?.restartedWithoutConsultation || 0) / (dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.restartData?.totalAntibioticUsers || 1)) * 100)}% restarted without consultation
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">6. Health Facility Preference</h3>
                      <div className="relative">
                        <button 
                          onMouseEnter={() => setShowDescription('healthFacilityPreference')}
                          onMouseLeave={() => setShowDescription(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        {showDescription === 'healthFacilityPreference' && (
                          <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                            {descriptions.healthFacilityPreference}
                          </div>
                        )}
                      </div>
                    </div>
                    <BarChartComponent 
                      data={[
                        { name: 'Government Health Centers', value: 65, color: '#3b82f6' },
                        { name: 'Private Clinics', value: 25, color: '#f59e0b' },
                        { name: 'Others', value: 10, color: '#6b7280' }
                      ]} 
                      dataKey="value" 
                      fill="#3b82f6"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                        65% prefer government health centers
                      </span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">10. Long-term Illness Prevalence</h3>
                      <div className="relative">
                        <button 
                          onMouseEnter={() => setShowDescription('longTermIllnessPrevalence')}
                          onMouseLeave={() => setShowDescription(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        {showDescription === 'longTermIllnessPrevalence' && (
                          <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                            {descriptions.longTermIllnessPrevalence}
                          </div>
                        )}
                      </div>
                    </div>
                    <BarChartComponent 
                      data={[
                        { name: 'With Chronic Illness', value: dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.longtermIllnessData?.withChronicIllness || 0, color: '#ef4444' },
                        { name: 'Total Respondents', value: dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.longtermIllnessData?.totalIllness || 0, color: '#6b7280' }
                      ]} 
                      dataKey="value" 
                      fill="#ef4444"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                        {Math.round(((dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.longtermIllnessData?.withChronicIllness || 0) / (dharwadData.performanceData.taluk[selectedTaluk]?.rawData?.longtermIllnessData?.totalIllness || 1)) * 100)}% with chronic illness
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">8. Barriers to Health Literacy</h3>
                      <div className="relative">
                        <button 
                          onMouseEnter={() => setShowDescription('barriersToHealthLiteracy')}
                          onMouseLeave={() => setShowDescription(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        {showDescription === 'barriersToHealthLiteracy' && (
                          <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                            {descriptions.barriersToHealthLiteracy}
                          </div>
                        )}
                      </div>
                    </div>
                    <BarChartComponent 
                      data={[
                        { name: 'Language Barrier', value: 35, color: '#8b5cf6' },
                        { name: 'Low Education', value: 28, color: '#f59e0b' },
                        { name: 'Limited Access', value: 22, color: '#10b981' },
                        { name: 'Cost', value: 15, color: '#ef4444' }
                      ]} 
                      dataKey="value" 
                      fill="#8b5cf6"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                        Language barrier is the main challenge
                      </span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">9. Average Distance to Pharmacy</h3>
                      <div className="relative">
                        <button 
                          onMouseEnter={() => setShowDescription('avgDistanceToPharmacy')}
                          onMouseLeave={() => setShowDescription(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        {showDescription === 'avgDistanceToPharmacy' && (
                          <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                            {descriptions.avgDistanceToPharmacy}
                          </div>
                        )}
                      </div>
                    </div>
                    <BarChartComponent 
                      data={[
                        { name: '< 2 km', value: 45, color: '#10b981' },
                        { name: '2-5 km', value: 35, color: '#f59e0b' },
                        { name: '5-10 km', value: 15, color: '#8b5cf6' },
                        { name: '> 10 km', value: 5, color: '#ef4444' }
                      ]} 
                      dataKey="value" 
                      fill="#10b981"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                        45% have pharmacy within 2 km
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">11. Source of Health Information</h3>
                      <div className="relative">
                        <button 
                          onMouseEnter={() => setShowDescription('sourceOfHealthInformation')}
                          onMouseLeave={() => setShowDescription(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        {showDescription === 'sourceOfHealthInformation' && (
                          <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                            {descriptions.sourceOfHealthInformation}
                          </div>
                        )}
                      </div>
                    </div>
                    <BarChartComponent 
                      data={[
                        { name: 'Government Health Workers (ASHA/ANM)', value: 45.2, color: '#3b82f6' },
                        { name: 'Private Doctors', value: 28.7, color: '#f59e0b' },
                        { name: 'Family/Friends', value: 12.3, color: '#10b981' },
                        { name: 'Television/Radio', value: 8.5, color: '#8b5cf6' },
                        { name: 'Internet/Social Media', value: 3.2, color: '#ef4444' },
                        { name: 'Newspapers/Magazines', value: 2.1, color: '#6b7280' }
                      ]} 
                      dataKey="value" 
                      fill="#3b82f6"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                        ASHA/ANM workers are the primary source of health information
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Taluk Level Performance Indicators */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Taluk Level Performance Indicators</h2>
                
                {/* Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Households Visited</h3>
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
                        { name: 'Visited This Week', value: 1250, color: '#3b82f6' },
                        { name: 'Total Assigned', value: talukData.households, color: '#6b7280' }
                      ]} 
                      dataKey="value" 
                      fill="#3b82f6"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                        1,250 of {talukData.households.toLocaleString('en-US')} households
                      </span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Individuals Data Collected</h3>
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
                        { name: 'Individuals Data Collected', value: 2890, color: '#8b5cf6' }
                      ]} 
                      dataKey="value" 
                      fill="#8b5cf6"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                        2,890 individuals reported this week
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Prescriptions Scanned</h3>
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
                        { month: 'Mon', value: 45 },
                        { month: 'Tue', value: 52 },
                        { month: 'Wed', value: 48 },
                        { month: 'Thu', value: 61 },
                        { month: 'Fri', value: 38 },
                        { month: 'Sat', value: 42 }
                      ]} 
                      dataKey="value" 
                      fill="#6366f1"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                        286 prescriptions uploaded this week
                      </span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Households with Sickness</h3>
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
                        { name: 'With Sickness', value: 320, color: '#ef4444' },
                        { name: 'Total Visited', value: 1250, color: '#3b82f6' }
                      ]} 
                      dataKey="value" 
                      fill="#ef4444"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                        25.6% of visited households
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Full Course Completion</h3>
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
                        { name: 'Completed Course', value: 2150, color: '#10b981' },
                        { name: 'Total Individuals', value: 2890, color: '#3b82f6' }
                      ]} 
                      dataKey="value" 
                      fill="#10b981"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                        74.4% completion rate
                      </span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Antibiotics from Pharmacy/Self</h3>
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
                        { name: 'From Pharmacy/Self', value: 289, color: '#ef4444' },
                        { name: 'Total Individuals', value: 2890, color: '#3b82f6' }
                      ]} 
                      dataKey="value" 
                      fill="#ef4444"
                    />
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-600">
                        10.0% without prescription
                      </span>
                    </div>
                  </div>
                                 </div>
               </div>

               {/* Symptoms Category for Taluk */}
               <div className="mb-8">
                 <h2 className="text-xl font-bold text-gray-900 mb-4">Symptoms Distribution in {talukData.name}</h2>
                 <div className="card">
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
                         <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                           {descriptions.symptomsCategory}
                         </div>
                       )}
                     </div>
                   </div>
                   <BarChartComponent 
                     data={[
                       { name: 'Fever (>38.3°C or >101°F)', count: 850, color: '#ef4444' },
                       { name: 'Chills and rigors', count: 680, color: '#f97316' },
                       { name: 'Headache', count: 625, color: '#8b5cf6' },
                       { name: 'Retro-orbital pain', count: 450, color: '#a855f7' },
                       { name: 'Severe malaise', count: 550, color: '#dc2626' },
                       { name: 'Myalgia (muscle pain)', count: 500, color: '#06b6d4' },
                       { name: 'Joint pain (arthralgia)', count: 400, color: '#f59e0b' },
                       { name: 'Painful swallowing (odynophagia)', count: 300, color: '#ec4899' },
                       { name: 'Sore throat', count: 375, color: '#f43f5e' },
                       { name: 'Tonsillar exudates', count: 200, color: '#be185d' },
                       { name: 'Palatal petechiae', count: 150, color: '#7c3aed' },
                       { name: 'Tender anterior cervical lymph nodes', count: 250, color: '#059669' },
                       { name: 'Ear pain (otalgia)', count: 225, color: '#0ea5e9' },
                       { name: 'Ear discharge (otorrhea)', count: 125, color: '#0891b2' },
                       { name: 'Bulging, erythematous tympanic membrane', count: 100, color: '#0369a1' },
                       { name: 'Facial pain', count: 175, color: '#7c2d12' },
                       { name: 'Purulent nasal discharge', count: 275, color: '#65a30d' },
                       { name: 'Cough (with or without sputum)', count: 750, color: '#ca8a04' },
                       { name: 'Shortness of breath (dyspnea)', count: 200, color: '#dc2626' },
                       { name: 'Pleuritic chest pain', count: 150, color: '#b91c1c' },
                       { name: 'New focal chest signs', count: 100, color: '#991b1b' },
                       { name: 'Bloody diarrhea (dysentery)', count: 225, color: '#15803d' },
                       { name: 'Abdominal pain', count: 350, color: '#16a34a' },
                       { name: 'Nausea or vomiting', count: 300, color: '#22c55e' },
                       { name: 'Neck stiffness', count: 125, color: '#84cc16' },
                       { name: 'Altered mental state or confusion', count: 75, color: '#eab308' },
                       { name: 'Systemic signs of severe infection', count: 100, color: '#f59e0b' },
                       { name: 'Others', count: 150, color: '#6b7280' }
                     ].map(symptom => ({
                       name: symptom.name,
                       value: symptom.count,
                       color: symptom.color
                     }))} 
                     dataKey="value" 
                     fill="#ef4444"
                   />
                   <div className="text-center mt-2">
                     <span className="text-sm text-gray-600">
                       Total: 7,250 cases reported in {talukData.name}
                     </span>
                   </div>
                 </div>
               </div>
             </div>
           </>
        )}
      </main>
    </div>
  )
}
