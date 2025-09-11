import { useState } from 'react'
import { districtData } from '../data/districtData'
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
import { Calendar, Users, Home, Activity, Info, AlertTriangle, TrendingUp, TrendingDown, Shield, Heart, Building, MapPin, FileText, BarChart3, Search, Filter } from 'lucide-react'

export default function Dashboard() {
  const [selectedDistrict, setSelectedDistrict] = useState('Dharwad')
  const [selectedTaluk, setSelectedTaluk] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDescription, setShowDescription] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const currentDistrictData = districtData.districts[selectedDistrict]
  const availableTaluks = currentDistrictData?.talukData || []
  const selectedTalukData = selectedTaluk ? availableTaluks.find(t => t.name === selectedTaluk) : null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const descriptions = {
    // Medical Office Level Indicators (1-8)
    antibioticUsageRate: "Share of patients on medicines who are using antibiotics. Formula: (Number of individuals who took antibiotics/Total number of Individuals who took any medicine)*100. Source: Q10",
    selfMedicationRate: "How many antibiotic users got them without a doctor's consultation. Formula: (Antibiotic users who did not consult a doctor/Total Number of Antibiotic Users)*100. Source: Q19, Q31",
    prescriptionAvailabilityRate: "How often antibiotics are backed by a valid prescription. Formula: (Antibiotic users with prescription/Total Number of Antibiotic users)*100. Source: Q20",
    courseCompletionRate: "How many finish their antibiotic course. Formula: (Antibiotic users who completed full course/Total Antibiotic Users)*100. Source: Q21",
    restartWithoutConsultation: "Cases of restarting antibiotics without medical advice. Formula: (Individuals who restarted antibiotics without consultation/Total Antibiotic users)*100. Source: Q22",
    awarenessOfAntibioticMisuse: "Level of knowledge about risks of misuse. Formula: (Individuals aware of consequences of Misuse/Total Respondents)*100. Source: Q24, Q25",
    householdsVisited: "Household coverage per ASHA under the PHC. Count of unique household records in the week. Source: Backend data",
    episodeRate: "Community antibiotic demand in the PHC's area. Formula: (Individuals with an antibiotic Q18) ÷ Households * 100. Source: Q18, Backend",
    
    // Additional Indicators (9-15)
    pharmacySelfSourcing: "Proportion getting antibiotics without a doctor. Formula: (Q19=Pharmacy + Q19=Self/Relatives) divided by 'In'. Source: Q19, Q18",
    incompleteCourses: "Adherence gap – not completing the course. Formula: Q21=No divided by Individuals with an antibiotic. Source: Q21, Q18",
    strongMedicineAsked: "Demand for stronger antibiotics. Formula: Q30=Yes divided by All individuals recorded. Source: Q30",
    tookAntibioticsWithoutHCP: "Self-medication - Habit of taking antibiotics without health professional advice. Formula: (Q31 ≠ 'Never') divided by All individuals recorded. Source: Q31",
    topSymptomsMix: "Common reasons for use. Share of each symptom among those with an illness. Source: Q15, Q18",
    couldNotGetMedicine: "Gaps in access to medicines and reasons for it. Formula: Q37=Yes divided by All individuals recorded. Source: Q37",
    prevalenceOfLongtermIllness: "Burden of chronic diseases in the area. Formula: (Individuals with chronic Illness / Total Illness) * 100. Source: Q15",
    
    // Legacy descriptions for compatibility
    antibioticUsage: "This shows how many people in the selected area are taking antibiotics. Higher numbers mean more people are using these medicines, which could indicate health issues or overuse.",
    selfMedication: "This measures how many people are taking antibiotics without proper doctor consultation. High rates are concerning as they can lead to antibiotic resistance.",
    restartWithoutConsultation: "This shows people who restart antibiotic courses without medical advice. This is dangerous and can make antibiotics less effective.",
    awareness: "This indicates how well people understand the risks of misusing antibiotics. Higher awareness usually means better usage patterns.",
    longtermIllness: "This shows how many people have chronic diseases requiring long-term medication. This helps us understand healthcare needs."
  }

  const getStatusColor = (value, threshold) => {
    if (value <= threshold) return 'text-green-600'
    if (value <= threshold * 1.2) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusIcon = (value, threshold) => {
    if (value <= threshold) return <TrendingDown className="w-4 h-4" />
    if (value <= threshold * 1.2) return <AlertTriangle className="w-4 h-4" />
    return <TrendingUp className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Government Header */}
      <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-white p-2 rounded-lg flex-shrink-0">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-800" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">Karnataka Health Dashboard</h1>
                <p className="text-blue-200 text-xs sm:text-sm">Government of Karnataka • Department of Health & Family Welfare</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs sm:text-sm text-blue-200">
                Last Updated: {formatDate(currentDistrictData?.lastUpdated || new Date())}
              </div>
              <div className="text-xs text-blue-300">Real-time Data Monitoring</div>
            </div>
          </div>
        </div>
      </header>

      {/* Selection Controls */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* District Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Select District
              </label>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value)
                  setSelectedTaluk('') // Reset taluk when district changes
                }}
              >
                {Object.keys(districtData.districts).map(districtKey => (
                  <option key={districtKey} value={districtKey}>
                    {districtData.districts[districtKey].name}
                  </option>
                ))}
              </select>
            </div>

            {/* Taluk Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Select Taluk
              </label>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={selectedTaluk}
                onChange={(e) => setSelectedTaluk(e.target.value)}
              >
                <option value="">Choose a Taluk</option>
                {availableTaluks.map(taluk => (
                  <option key={taluk.name} value={taluk.name}>
                    {taluk.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by Household ID, ASHA, PHC..."
                className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 sm:space-x-4 lg:space-x-8 min-w-max">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'antibiotics', name: 'Antibiotic Usage', icon: AlertTriangle },
                { id: 'healthcare', name: 'Healthcare Access', icon: Heart },
                { id: 'infrastructure', name: 'Infrastructure', icon: Building },
                { id: 'demographics', name: 'Population', icon: Users },
                { id: 'indicators', name: 'Core Indicators', icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Area Selection Status */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedTaluk ? `${selectedTaluk} Analysis` : `${currentDistrictData?.name} Overview`}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Data Available</span>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              {selectedTaluk 
                ? `Showing detailed analysis for ${selectedTaluk} within ${currentDistrictData?.name}. This view displays specific metrics and trends for the selected taluk.`
                : `Welcome to the ${currentDistrictData?.name} Health Dashboard. Select a taluk to view detailed area-specific analysis.`
              }
            </p>
          </div>
        </div>

        {/* Overview Stats - Show selected area data only */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {selectedTaluk ? 'Taluk Households' : 'Total Households'}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {selectedTaluk 
                    ? selectedTalukData?.households?.toLocaleString('en-US') 
                    : currentDistrictData?.totalHouseholds?.toLocaleString('en-US')
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedTaluk ? 'Families in selected taluk' : 'Families covered by our healthcare system'}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Home className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {selectedTaluk ? 'Taluk Population' : 'Total Population'}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {selectedTaluk 
                    ? selectedTalukData?.population?.toLocaleString('en-US') 
                    : currentDistrictData?.totalIndividuals?.toLocaleString('en-US')
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedTaluk ? 'People in selected taluk' : 'People under healthcare monitoring'}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {selectedTaluk ? 'Taluk ASHAs' : 'Active ASHAs'}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {selectedTaluk 
                    ? selectedTalukData?.ashaCount 
                    : currentDistrictData?.activeASHAs
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedTaluk ? 'Community health workers in taluk' : 'Community health workers on duty'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coverage Period</p>
                <p className="text-3xl font-bold text-gray-900">Jan-Jun</p>
                <p className="text-xs text-gray-500 mt-1">Current monitoring period 2024</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Key Health Indicators - Show selected area data only */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Antibiotic Usage</h3>
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-yellow-600">
                {selectedTaluk 
                  ? `${selectedTalukData?.antibioticUsage}%`
                  : `${currentDistrictData?.indicators?.antibioticUsage?.current}%`
                }
              </div>
              <p className="text-sm text-gray-600">
                {selectedTaluk ? 'of medicine users in taluk' : 'of medicine users taking antibiotics'}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Status:</strong> 
                {selectedTaluk 
                  ? ` ${selectedTalukData?.antibioticUsage > 70 ? 'High usage - needs attention' : 'Within acceptable range'}`
                  : ` ${currentDistrictData?.indicators?.antibioticUsage?.current > 70 ? 'High usage - needs attention' : 'Within acceptable range'}`
                }
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Self-Medication Rate</h3>
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-red-600">
                {selectedTaluk 
                  ? `${selectedTalukData?.selfMedication}%`
                  : `${currentDistrictData?.indicators?.selfMedication?.current}%`
                }
              </div>
              <p className="text-sm text-gray-600">
                {selectedTaluk ? 'in taluk without prescription' : 'obtaining antibiotics without prescription'}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Risk Level:</strong> 
                {selectedTaluk 
                  ? ` ${selectedTalukData?.selfMedication > 40 ? 'High Risk' : 'Moderate Risk'}`
                  : ` ${currentDistrictData?.indicators?.selfMedication?.current > 40 ? 'High Risk' : 'Moderate Risk'}`
                }
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Public Awareness</h3>
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-600">
                {selectedTaluk 
                  ? `${selectedTalukData?.awareness}%`
                  : `${currentDistrictData?.indicators?.antibioticMisuseAwareness?.current}%`
                }
              </div>
              <p className="text-sm text-gray-600">
                {selectedTaluk ? 'aware in taluk' : 'aware of antibiotic misuse risks'}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Status:</strong> 
                {selectedTaluk 
                  ? ` ${selectedTalukData?.awareness > 60 ? 'Good awareness levels' : 'Needs improvement'}`
                  : ` ${currentDistrictData?.indicators?.antibioticMisuseAwareness?.current > 60 ? 'Good awareness levels' : 'Needs improvement'}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Monthly Trends - Show selected area trends only */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedTaluk ? `${selectedTaluk} Monthly Trends` : `${currentDistrictData?.name} Monthly Trends`}
                  </h3>
                  <p className="text-gray-600">
                    {selectedTaluk 
                      ? `Track how ${selectedTaluk}'s health metrics change over time`
                      : `Track how ${currentDistrictData?.name}'s health metrics change over time`
                    }
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onMouseEnter={() => setShowDescription('antibioticUsage')}
                    onMouseLeave={() => setShowDescription(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {showDescription === 'antibioticUsage' && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{descriptions.antibioticUsage}</p>
                </div>
              )}
              <LineChartComponent 
                data={currentDistrictData?.monthlyTrends || []} 
                dataKey="antibioticUsage" 
                stroke="#3b82f6"
              />
            </div>

            {/* Single Area Performance - No comparisons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {selectedTaluk ? `${selectedTaluk} Antibiotic Usage` : `${currentDistrictData?.name} Antibiotic Usage`}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedTaluk 
                    ? `Current antibiotic usage rate in ${selectedTaluk}`
                    : `Current antibiotic usage rate in ${currentDistrictData?.name}`
                  }
                </p>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {selectedTaluk 
                      ? `${selectedTalukData?.antibioticUsage}%`
                      : `${currentDistrictData?.indicators?.antibioticUsage?.current}%`
                    }
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedTaluk 
                      ? `of medicine users in ${selectedTaluk} are taking antibiotics`
                      : `of medicine users in ${currentDistrictData?.name} are taking antibiotics`
                    }
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {selectedTaluk ? `${selectedTaluk} Self-Medication` : `${currentDistrictData?.name} Self-Medication`}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedTaluk 
                    ? `Self-medication rate in ${selectedTaluk}`
                    : `Self-medication rate in ${currentDistrictData?.name}`
                  }
                </p>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    {selectedTaluk 
                      ? `${selectedTalukData?.selfMedication}%`
                      : `${currentDistrictData?.indicators?.selfMedication?.current}%`
                    }
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedTaluk 
                      ? `of antibiotic users in ${selectedTaluk} self-medicate`
                      : `of antibiotic users in ${currentDistrictData?.name} self-medicate`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

                 {/* Other tabs would follow similar pattern - showing only selected area data */}
         {activeTab === 'indicators' && (
           <div className="space-y-8">
             <div className="bg-white rounded-xl shadow-lg p-6">
               <h3 className="text-xl font-bold text-gray-900 mb-4">
                 {selectedTaluk ? `${selectedTaluk} Core Indicators` : `${currentDistrictData?.name} Core Indicators`}
               </h3>
               <p className="text-gray-600 mb-6">
                 {selectedTaluk 
                   ? `Key healthcare indicators specific to ${selectedTaluk}`
                   : `Key healthcare indicators for ${currentDistrictData?.name}`
                 }
               </p>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Self-Medication Rate Gauge - Selected area only */}
                 <div className="bg-gray-50 rounded-lg p-6">
                   <GaugeChart 
                     value={selectedTaluk 
                       ? selectedTalukData?.selfMedication || 0
                       : currentDistrictData?.indicators?.selfMedication?.current || 0
                     }
                     title="Self-Medication Rate"
                     subtitle={selectedTaluk ? selectedTaluk : currentDistrictData?.name}
                     previousValue={selectedTaluk 
                       ? (selectedTalukData?.selfMedication || 0) - 2.3
                       : currentDistrictData?.indicators?.selfMedication?.previous || 0
                     }
                     size="medium"
                   />
                 </div>

                 {/* Other indicators would follow same pattern */}
                 <div className="bg-gray-50 rounded-lg p-6">
                   <h4 className="text-lg font-semibold text-gray-900 mb-4">Antibiotic Usage Prevalence</h4>
                   <div className="text-center">
                     <div className="text-4xl font-bold text-blue-600 mb-2">
                       {selectedTaluk 
                         ? `${selectedTalukData?.antibioticUsage || 0}%`
                         : `${currentDistrictData?.indicators?.antibioticUsage?.current || 0}%`
                       }
                     </div>
                     <p className="text-sm text-gray-600 mb-4">
                       Share of medicine users taking antibiotics
                     </p>
                   </div>
                 </div>
               </div>
             </div>

             {/* Health Information Sources */}
             <div className="bg-white rounded-xl shadow-lg p-6">
               <h3 className="text-xl font-bold text-gray-900 mb-4">Sources of Health Information</h3>
               <p className="text-gray-600 mb-6">
                 Understanding where people get their health information helps us plan better awareness campaigns.
               </p>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div>
                   <h4 className="text-lg font-semibold text-gray-900 mb-4">Information Sources Distribution</h4>
                   <PieChartComponent 
                     data={currentDistrictData?.healthInfoSources?.map(item => ({
                       source: item.source,
                       percentage: item.percentage
                     })) || []}
                   />
                 </div>
                 <div>
                   <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h4>
                   <div className="space-y-3">
                     {(currentDistrictData?.healthInfoSources || []).map((source, index) => (
                       <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                         <span className="text-sm font-medium text-gray-700">{source.source}</span>
                         <span className="text-sm font-bold text-blue-600">{source.percentage}%</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}

        {/* Medical Office Level Indicators */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Medical Office Level Indicators</h3>
              <p className="text-gray-600">Comprehensive healthcare metrics for medical office monitoring and decision-making</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Building className="w-4 h-4" />
              <span>PHC Level Analysis</span>
            </div>
          </div>

          {/* Medical Office Indicators Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 1. Antibiotic Usage Rate */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">1. Antibiotic Usage Rate</h4>
                <div className="relative">
                  <button 
                    onMouseEnter={() => setShowDescription('antibioticUsageRate')}
                    onMouseLeave={() => setShowDescription(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  {showDescription === 'antibioticUsageRate' && (
                    <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                      {descriptions.antibioticUsageRate}
                    </div>
                  )}
                </div>
              </div>
              <BarChartComponent 
                data={[
                  { name: 'Antibiotic Users', value: 2500, color: '#3b82f6' },
                  { name: 'Total Medicine Users', value: 3720, color: '#6b7280' }
                ]} 
                dataKey="value" 
                fill="#3b82f6"
              />
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-blue-600">67.2%</div>
                <p className="text-sm text-gray-600">Share of medicine users taking antibiotics</p>
              </div>
            </div>

            {/* 2. Self-Medication Rate */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">2. Self-Medication Rate</h4>
                <div className="relative">
                  <button 
                    onMouseEnter={() => setShowDescription('selfMedicationRate')}
                    onMouseLeave={() => setShowDescription(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  {showDescription === 'selfMedicationRate' && (
                    <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                      {descriptions.selfMedicationRate}
                    </div>
                  )}
                </div>
              </div>
              <BarChartComponent 
                data={[
                  { name: 'Without Doctor Consultation', value: 1045, color: '#ef4444' },
                  { name: 'Total Antibiotic Users', value: 2500, color: '#6b7280' }
                ]} 
                dataKey="value" 
                fill="#ef4444"
              />
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-red-600">41.8%</div>
                <p className="text-sm text-gray-600">Antibiotic users without doctor consultation</p>
              </div>
            </div>

            {/* 3. Prescription Availability Rate */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">3. Prescription Availability Rate</h4>
                <div className="relative">
                  <button 
                    onMouseEnter={() => setShowDescription('prescriptionAvailabilityRate')}
                    onMouseLeave={() => setShowDescription(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  {showDescription === 'prescriptionAvailabilityRate' && (
                    <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                      {descriptions.prescriptionAvailabilityRate}
                    </div>
                  )}
                </div>
              </div>
              <BarChartComponent 
                data={[
                  { name: 'With Prescription', value: 1800, color: '#10b981' },
                  { name: 'Without Prescription', value: 700, color: '#ef4444' }
                ]} 
                dataKey="value" 
                fill="#10b981"
              />
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-green-600">72.0%</div>
                <p className="text-sm text-gray-600">Antibiotics backed by valid prescription</p>
              </div>
            </div>

            {/* 4. Course Completion Rate */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">4. Course Completion Rate</h4>
                <div className="relative">
                  <button 
                    onMouseEnter={() => setShowDescription('courseCompletionRate')}
                    onMouseLeave={() => setShowDescription(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  {showDescription === 'courseCompletionRate' && (
                    <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                      {descriptions.courseCompletionRate}
                    </div>
                  )}
                </div>
              </div>
              <BarChartComponent 
                data={[
                  { name: 'Completed Full Course', value: 1750, color: '#10b981' },
                  { name: 'Did Not Complete', value: 750, color: '#ef4444' }
                ]} 
                dataKey="value" 
                fill="#10b981"
              />
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-green-600">70.0%</div>
                <p className="text-sm text-gray-600">Antibiotic users who completed full course</p>
              </div>
            </div>

            {/* 5. Restart Without Consultation */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">5. Restart Without Consultation</h4>
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
                  { name: 'Restarted Without Consultation', value: 725, color: '#f59e0b' },
                  { name: 'Total Antibiotic Users', value: 2500, color: '#6b7280' }
                ]} 
                dataKey="value" 
                fill="#f59e0b"
              />
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-orange-600">29.0%</div>
                <p className="text-sm text-gray-600">Restarted antibiotics without medical advice</p>
              </div>
            </div>

            {/* 6. Awareness of Antibiotic Misuse */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">6. Awareness of Antibiotic Misuse</h4>
                <div className="relative">
                  <button 
                    onMouseEnter={() => setShowDescription('awarenessOfAntibioticMisuse')}
                    onMouseLeave={() => setShowDescription(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  {showDescription === 'awarenessOfAntibioticMisuse' && (
                    <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                      {descriptions.awarenessOfAntibioticMisuse}
                    </div>
                  )}
                </div>
              </div>
              <BarChartComponent 
                data={[
                  { name: 'Aware of Consequences', value: 1650, color: '#10b981' },
                  { name: 'Not Aware', value: 850, color: '#ef4444' }
                ]} 
                dataKey="value" 
                fill="#10b981"
              />
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-green-600">66.0%</div>
                <p className="text-sm text-gray-600">Aware of antibiotic misuse consequences</p>
              </div>
            </div>

            {/* 7. Households Visited */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">7. Households Visited (Week)</h4>
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
                  { name: 'Visited This Week', value: 850, color: '#8b5cf6' },
                  { name: 'Total Assigned', value: 1200, color: '#6b7280' }
                ]} 
                dataKey="value" 
                fill="#8b5cf6"
              />
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-purple-600">850</div>
                <p className="text-sm text-gray-600">Households visited by ASHAs this week</p>
              </div>
            </div>

            {/* 8. Episode Rate */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">8. Episode Rate (per 100 households)</h4>
                <div className="relative">
                  <button 
                    onMouseEnter={() => setShowDescription('episodeRate')}
                    onMouseLeave={() => setShowDescription(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  {showDescription === 'episodeRate' && (
                    <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                      {descriptions.episodeRate}
                    </div>
                  )}
                </div>
              </div>
              <BarChartComponent 
                data={[
                  { name: 'Individuals with Antibiotics', value: 2500, color: '#f59e0b' },
                  { name: 'Total Households', value: 52000, color: '#6b7280' }
                ]} 
                dataKey="value" 
                fill="#f59e0b"
              />
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-orange-600">4.8</div>
                <p className="text-sm text-gray-600">Antibiotic episodes per 100 households</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-blue-900">Key Performance</h5>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-blue-700">
                72% prescription availability and 70% course completion show good healthcare practices.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-red-900">Areas of Concern</h5>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-sm text-red-700">
                41.8% self-medication rate and 29% restart without consultation need immediate attention.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-green-900">Positive Trends</h5>
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-green-700">
                66% awareness of antibiotic misuse and 850 households visited show good outreach.
              </p>
            </div>
          </div>
        </div>

        {/* Dharwad District Monthly Trends */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Dharwad District Monthly Trends</h3>
              <p className="text-gray-600">Comprehensive analysis of key health indicators over the past 6 months</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Jan 2024 - Jun 2024</span>
            </div>
          </div>

          {/* Monthly Trends Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Antibiotic Usage Trend */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Antibiotic Usage Trend</h4>
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
              <LineChartComponent 
                data={healthcareData.epidemiologicalTrends}
                dataKey="antibioticUsage"
                stroke="#3b82f6"
                fill="#3b82f6"
                title="Monthly Antibiotic Usage (%)"
              />
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {healthcareData.epidemiologicalTrends[healthcareData.epidemiologicalTrends.length - 1]?.antibioticUsage}%
                </div>
                <p className="text-sm text-gray-600">Current month (June 2024)</p>
              </div>
            </div>

            {/* Self-Medication Trend */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Self-Medication Trend</h4>
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
              <LineChartComponent 
                data={healthcareData.epidemiologicalTrends}
                dataKey="selfMedication"
                stroke="#ef4444"
                fill="#ef4444"
                title="Monthly Self-Medication Rate (%)"
              />
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {healthcareData.epidemiologicalTrends[healthcareData.epidemiologicalTrends.length - 1]?.selfMedication}%
                </div>
                <p className="text-sm text-gray-600">Current month (June 2024)</p>
              </div>
            </div>
          </div>

          {/* Awareness Trend */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Public Awareness Trend</h4>
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
            <LineChartComponent 
              data={healthcareData.epidemiologicalTrends}
              dataKey="awareness"
              stroke="#10b981"
              fill="#10b981"
              title="Monthly Public Awareness Level (%)"
            />
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {healthcareData.epidemiologicalTrends[healthcareData.epidemiologicalTrends.length - 1]?.awareness}%
              </div>
              <p className="text-sm text-gray-600">Current month (June 2024)</p>
            </div>
          </div>

          {/* Monthly Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-blue-900">Trend Analysis</h5>
                <TrendingDown className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-blue-700">
                Antibiotic usage has decreased by 3.8% over 6 months, showing positive impact of awareness campaigns.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-red-900">Concern Area</h5>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-sm text-red-700">
                Self-medication rate remains high at 42.1%. Need intensified intervention programs.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-green-900">Success Story</h5>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-green-700">
                Public awareness has improved by 6.7% over 6 months, reaching 65.4% in June 2024.
              </p>
            </div>
          </div>

          {/* Detailed Monthly Data Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">Detailed Monthly Data</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Antibiotic Usage (%)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Self-Medication (%)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Awareness (%)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {healthcareData.epidemiologicalTrends.map((month, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{month.antibioticUsage}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{month.selfMedication}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{month.awareness}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          month.antibioticUsage < 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {month.antibioticUsage < 70 ? 'Good' : 'Needs Attention'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Items Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">
            {selectedTaluk ? `${selectedTaluk} Action Plan` : `${currentDistrictData?.name} Action Plan`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-yellow-300" />
                <h4 className="font-semibold">Immediate Actions</h4>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Increase awareness campaigns in selected area</li>
                <li>• Strengthen prescription monitoring systems</li>
                <li>• Deploy additional ASHAs if needed</li>
              </ul>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-6 h-6 text-green-300" />
                <h4 className="font-semibold">Long-term Goals</h4>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Reduce antibiotic usage by 20%</li>
                <li>• Achieve 90% awareness levels</li>
                <li>• Improve healthcare access</li>
              </ul>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-6 h-6 text-blue-300" />
                <h4 className="font-semibold">Reports & Monitoring</h4>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Weekly progress reports</li>
                <li>• Monthly stakeholder meetings</li>
                <li>• Quarterly performance reviews</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
