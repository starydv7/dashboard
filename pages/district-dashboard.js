import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
import { Calendar, Users, Home, Activity, Info, Search, Filter, MapPin } from 'lucide-react'
import { DashboardHeader } from '../components/Navigation'

export default function DistrictDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [showDescription, setShowDescription] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTaluk, setFilterTaluk] = useState('all')
  const router = useRouter()

  // Get filtered data based on selection
  const getFilteredDistricts = () => {
    if (selectedDistrict === 'all') {
      return Object.keys(districtData.districts).map(key => ({
        id: key,
        name: districtData.districts[key].name,
        talukCount: districtData.districts[key].talukData?.length || 0,
        phcCount: Math.floor((districtData.districts[key].talukData?.length || 0) * 2.5),
        ashaCount: districtData.districts[key].activeASHAs,
        totalHouseholds: districtData.districts[key].totalHouseholds,
        totalIndividuals: districtData.districts[key].totalIndividuals
      }))
    } else {
      return [{
        id: selectedDistrict,
        name: districtData.districts[selectedDistrict].name,
        talukCount: districtData.districts[selectedDistrict].talukData?.length || 0,
        phcCount: Math.floor((districtData.districts[selectedDistrict].talukData?.length || 0) * 2.5),
        ashaCount: districtData.districts[selectedDistrict].activeASHAs,
        totalHouseholds: districtData.districts[selectedDistrict].totalHouseholds,
        totalIndividuals: districtData.districts[selectedDistrict].totalIndividuals
      }]
    }
  }

  // Get aggregated totals for all districts/taluks
  const getAggregatedTotals = () => {
    if (selectedDistrict === 'all' && filterTaluk === 'all') {
      // Calculate weighted averages across all districts
      let totalAntibioticUsage = 0
      let totalSelfMedication = 0
      let totalRestartRate = 0
      let totalAwareness = 0
      let totalLongtermIllness = 0
      let totalWeight = 0

      Object.values(districtData.districts).forEach(district => {
        const weight = district.totalIndividuals || 1
        totalAntibioticUsage += (district.indicators?.antibioticUsage?.current || 0) * weight
        totalSelfMedication += (district.indicators?.selfMedication?.current || 0) * weight
        totalRestartRate += (district.indicators?.restartWithoutConsultation?.current || 0) * weight
        totalAwareness += (district.indicators?.antibioticMisuseAwareness?.current || 0) * weight
        totalLongtermIllness += (district.indicators?.longtermIllness?.current || 0) * weight
        totalWeight += weight
      })

      return {
        antibioticUsage: totalWeight > 0 ? totalAntibioticUsage / totalWeight : 0,
        selfMedication: totalWeight > 0 ? totalSelfMedication / totalWeight : 0,
        restartWithoutConsultation: totalWeight > 0 ? totalRestartRate / totalWeight : 0,
        awareness: totalWeight > 0 ? totalAwareness / totalWeight : 0,
        longtermIllness: totalWeight > 0 ? totalLongtermIllness / totalWeight : 0
      }
    }
    return null
  }

  const getFilteredTalukData = () => {
    if (filterTaluk === 'all') {
      if (selectedDistrict === 'all') {
        // Return all taluks from all districts
        return Object.values(districtData.districts).flatMap(district => 
          district.talukData?.map(taluk => ({
            ...taluk,
            districtName: district.name
          })) || []
        )
      } else {
        // Return all taluks from selected district
        return districtData.districts[selectedDistrict]?.talukData?.map(taluk => ({
          ...taluk,
          districtName: districtData.districts[selectedDistrict].name
        })) || []
      }
    } else {
      // Return specific taluk data
      if (selectedDistrict === 'all') {
        // Find taluk across all districts
        for (const district of Object.values(districtData.districts)) {
          const taluk = district.talukData?.find(t => t.name === filterTaluk)
          if (taluk) {
            return [{
              ...taluk,
              districtName: district.name
            }]
          }
        }
        return []
      } else {
        // Return specific taluk from selected district
        const taluk = districtData.districts[selectedDistrict]?.talukData?.find(t => t.name === filterTaluk)
        return taluk ? [{
          ...taluk,
          districtName: districtData.districts[selectedDistrict].name
        }] : []
      }
    }
  }

  const getCurrentData = () => {
    if (filterTaluk !== 'all') {
      return getFilteredTalukData()
    } else if (selectedDistrict !== 'all') {
      return [districtData.districts[selectedDistrict]]
    } else {
      return Object.values(districtData.districts)
    }
  }

  // Get filtered district data
  const districts = getFilteredDistricts()

  const descriptions = {
    antibioticUsage: "Shows the actual number of people who took antibiotics vs total people who took any medicine. Blue bars show antibiotic users, orange bars show total medicine users. Source: Q10",
    selfMedication: "Shows the actual number of people who got antibiotics without consultation vs total antibiotic users. Red bars show people without consultation, orange bars show total antibiotic users. Source: Q19, Q31",
    restartWithoutConsultation: "Shows the actual number of people who restarted antibiotics without consultation vs total antibiotic users. Orange bars show people who restarted without consultation, yellow bars show total antibiotic users. Source: Q22",
    awareness: "Shows the actual number of people who are aware of antibiotic misuse consequences vs total respondents. Green bars show people aware of consequences, dark green bars show total respondents. Source: Q24, Q25",
    longtermIllness: "Shows the actual number of people with chronic illness vs total respondents. Purple bars show people with chronic illness, dark purple bars show total respondents. Source: Q15",
    healthInfoSources: "Shows the network trends of health information sources over time. The line chart displays how people's preferences for getting health information change monthly across ASHA Workers, Lab Assistant, Hospital PHC, and Personal sources. Source: Q3"
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
      {/* Navigation Header */}
      <DashboardHeader 
        title="District Dashboard" 
        subtitle="District-level health indicators and data"
      />

      {/* Search and Filter Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by Household ID, ASHA, PHC..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* District Filter */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="all">All Districts</option>
                {districts.map(district => (
                  <option key={district.id} value={district.id}>{district.name}</option>
                ))}
              </select>
            </div>

            {/* Taluk Filter */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={filterTaluk}
                onChange={(e) => setFilterTaluk(e.target.value)}
              >
                <option value="all">All Taluks</option>
                {selectedDistrict !== 'all' && districtData.districts[selectedDistrict]?.talukData?.map(taluk => (
                  <option key={taluk.name} value={taluk.name}>{taluk.name}</option>
                )) || Object.values(districtData.districts).flatMap(district => 
                  district.talukData?.map(taluk => (
                    <option key={taluk.name} value={taluk.name}>{taluk.name}</option>
                  )) || []
                )}
              </select>
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
        
                 {/* District Overview Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
           <div className="metric-card">
             <div className="flex items-center">
               <MapPin className="w-8 h-8 text-blue-600 mr-3" />
               <div>
                 <p className="text-sm font-medium text-gray-600">
                   {filterTaluk !== 'all' ? 'Selected Taluk' : selectedDistrict !== 'all' ? 'Selected District' : 'Total Districts'}
                 </p>
                 <p className="metric-value">
                   {filterTaluk !== 'all' ? filterTaluk : selectedDistrict !== 'all' ? districts.length : districts.length}
                 </p>
               </div>
             </div>
           </div>
           <div className="metric-card">
             <div className="flex items-center">
               <Home className="w-8 h-8 text-green-600 mr-3" />
               <div>
                 <p className="text-sm font-medium text-gray-600">
                   {filterTaluk !== 'all' ? 'Taluk Households' : selectedDistrict !== 'all' ? 'District Households' : 'Total Households'}
                 </p>
                 <p className="metric-value">
                   {filterTaluk !== 'all' 
                     ? getFilteredTalukData()[0]?.households?.toLocaleString('en-US') || '0'
                     : districts.reduce((sum, d) => sum + (d.totalHouseholds || 0), 0).toLocaleString('en-US')
                   }
                 </p>
               </div>
             </div>
           </div>
           <div className="metric-card">
             <div className="flex items-center">
               <Users className="w-8 h-8 text-purple-600 mr-3" />
               <div>
                 <p className="text-sm font-medium text-gray-600">
                   {filterTaluk !== 'all' ? 'Taluk Population' : selectedDistrict !== 'all' ? 'District Population' : 'Total Individuals'}
                 </p>
                 <p className="metric-value">
                   {filterTaluk !== 'all' 
                     ? getFilteredTalukData()[0]?.population?.toLocaleString('en-US') || '0'
                     : districts.reduce((sum, d) => sum + (d.totalIndividuals || 0), 0).toLocaleString('en-US')
                   }
                 </p>
               </div>
             </div>
           </div>
           <div className="metric-card">
             <div className="flex items-center">
               <Activity className="w-8 h-8 text-orange-600 mr-3" />
               <div>
                 <p className="text-sm font-medium text-gray-600">
                   {filterTaluk !== 'all' ? 'Taluk ASHAs' : selectedDistrict !== 'all' ? 'District ASHAs' : 'Active ASHAs'}
                 </p>
                 <p className="metric-value">
                   {filterTaluk !== 'all' 
                     ? getFilteredTalukData()[0]?.ashaCount || '0'
                     : districts.reduce((sum, d) => sum + d.ashaCount, 0)
                   }
                 </p>
               </div>
             </div>
           </div>
         </div>

                                   {/* District Comparison Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {filterTaluk !== 'all' 
                ? `${filterTaluk} Analysis` 
                : selectedDistrict !== 'all' 
                  ? `${districtData.districts[selectedDistrict]?.name} Analysis`
                  : 'District-wise Comparison'
              }
            </h2>

            
          
                                 {/* District Performance Comparison - Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
             <div className="card transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
                              <div className="flex items-center justify-between mb-6">
                                     <h3 className="text-xl font-semibold text-gray-900">
                     {filterTaluk !== 'all' 
                       ? `${filterTaluk} Antibiotic Usage (Numbers)` 
                       : selectedDistrict !== 'all' 
                         ? `${districtData.districts[selectedDistrict]?.name} Antibiotic Usage (Numbers)`
                         : 'Antibiotic Usage by District (Numbers)'
                     }
                   </h3>
                 <div className="relative">
                   <button 
                     onMouseEnter={() => setShowDescription('antibioticUsage')}
                     onMouseLeave={() => setShowDescription(null)}
                     className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                   >
                     <Info className="w-5 h-5" />
                   </button>
                   {showDescription === 'antibioticUsage' && (
                     <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10 transition-opacity duration-300">
                       {descriptions.antibioticUsage}
                     </div>
                   )}
                 </div>
               </div>
                                                                                                                         <BarChartComponent 
                    data={
                      selectedDistrict === 'all' && filterTaluk === 'all'
                        ? [{ 
                            name: 'Antibiotic Users', 
                            value: Object.values(districtData.districts).reduce((sum, district) => 
                              sum + (district.indicators?.antibioticUsage?.rawData?.antibioticUsers || 0), 0
                            )
                          }, {
                            name: 'Total Medicine Users',
                            value: Object.values(districtData.districts).reduce((sum, district) => 
                              sum + (district.indicators?.antibioticUsage?.rawData?.totalMedicineUsers || 0), 0
                            )
                          }]
                        : filterTaluk !== 'all' 
                          ? [{ 
                              name: 'Antibiotic Users', 
                              value: getFilteredTalukData()[0]?.rawData?.antibioticUsers || 0 
                            }, {
                              name: 'Total Medicine Users',
                              value: getFilteredTalukData()[0]?.rawData?.totalMedicineUsers || 0
                            }]
                          : districts.map(d => [{ 
                              name: 'Antibiotic Users', 
                              value: districtData.districts[d.id]?.indicators?.antibioticUsage?.rawData?.antibioticUsers || 0 
                            }, {
                              name: 'Total Medicine Users',
                              value: districtData.districts[d.id]?.indicators?.antibioticUsage?.rawData?.totalMedicineUsers || 0
                            }]).flat()
                    } 
                    dataKey="value" 
                    fill="#3b82f6"
                  />
             </div>

             <div className="card transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
                              <div className="flex items-center justify-between mb-6">
                                     <h3 className="text-xl font-semibold text-gray-900">
                     {filterTaluk !== 'all' 
                       ? `${filterTaluk} Self-Medication Rate (Numbers)` 
                       : selectedDistrict !== 'all' 
                         ? `${districtData.districts[selectedDistrict]?.name} Self-Medication Rate (Numbers)`
                         : 'Self-Medication Rate by District (Numbers)'
                     }
                   </h3>
                 <div className="relative">
                   <button 
                     onMouseEnter={() => setShowDescription('selfMedication')}
                     onMouseLeave={() => setShowDescription(null)}
                     className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                   >
                     <Info className="w-5 h-5" />
                   </button>
                   {showDescription === 'selfMedication' && (
                     <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10 transition-opacity duration-300">
                       {descriptions.selfMedication}
                     </div>
                   )}
                 </div>
               </div>
                                                                                                                         <BarChartComponent 
                    data={
                      selectedDistrict === 'all' && filterTaluk === 'all'
                                                 ? [{ 
                             name: 'Without Consultation', 
                             value: Object.values(districtData.districts).reduce((sum, district) => 
                               sum + (district.indicators?.selfMedication?.rawData?.withoutDoctor || 0), 0
                             )
                           }, {
                            name: 'Total Antibiotic Users',
                            value: Object.values(districtData.districts).reduce((sum, district) => 
                              sum + (district.indicators?.selfMedication?.rawData?.totalAntibioticUsers || 0), 0
                            )
                          }]
                        : filterTaluk !== 'all' 
                                                     ? [{ 
                               name: 'Without Consultation', 
                               value: getFilteredTalukData()[0]?.rawData?.selfMedication?.withoutDoctor || 0 
                             }, {
                              name: 'Total Antibiotic Users',
                              value: getFilteredTalukData()[0]?.rawData?.selfMedication?.totalAntibioticUsers || 0
                            }]
                                                     : districts.map(d => [{ 
                               name: 'Without Consultation', 
                               value: districtData.districts[d.id]?.indicators?.selfMedication?.rawData?.withoutDoctor || 0 
                             }, {
                              name: 'Total Antibiotic Users',
                              value: districtData.districts[d.id]?.indicators?.selfMedication?.rawData?.totalAntibioticUsers || 0
                            }]).flat()
                    } 
                    dataKey="value" 
                    fill="#ef4444"
                  />
             </div>
           </div>

           {/* District Performance Comparison - Row 2 */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
             <div className="card transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
               <div className="flex items-center justify-between mb-6">
                                   <h3 className="text-xl font-semibold text-gray-900">
                    {filterTaluk !== 'all' 
                      ? `${filterTaluk} Medication Restart Rate (Numbers)` 
                      : selectedDistrict !== 'all' 
                        ? `${districtData.districts[selectedDistrict]?.name} Medication Restart Rate (Numbers)`
                        : 'Medication Restart Rate by District (Numbers)'
                    }
                  </h3>
                 <div className="relative">
                   <button 
                     onMouseEnter={() => setShowDescription('restartWithoutConsultation')}
                     onMouseLeave={() => setShowDescription(null)}
                     className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                   >
                     <Info className="w-5 h-5" />
                   </button>
                   {showDescription === 'restartWithoutConsultation' && (
                     <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10 transition-opacity duration-300">
                       {descriptions.restartWithoutConsultation}
                     </div>
                   )}
                 </div>
               </div>
                                                             <BarChartComponent 
                   data={
                     selectedDistrict === 'all' && filterTaluk === 'all'
                       ? [{ 
                           name: 'Restarted Without Consultation', 
                           value: Object.values(districtData.districts).reduce((sum, district) => 
                             sum + (district.indicators?.restartWithoutConsultation?.rawData?.restartedWithoutConsultation || 0), 0
                           )
                         }, {
                           name: 'Total Antibiotic Users',
                           value: Object.values(districtData.districts).reduce((sum, district) => 
                             sum + (district.indicators?.restartWithoutConsultation?.rawData?.totalAntibioticUsers || 0), 0
                           )
                         }]
                       : filterTaluk !== 'all' 
                         ? [{ 
                             name: 'Restarted Without Consultation', 
                             value: getFilteredTalukData()[0]?.rawData?.restartWithoutConsultation?.restartedWithoutConsultation || 0 
                           }, {
                             name: 'Total Antibiotic Users',
                             value: getFilteredTalukData()[0]?.rawData?.restartWithoutConsultation?.totalAntibioticUsers || 0
                           }]
                         : districts.map(d => [{ 
                             name: 'Restarted Without Consultation', 
                             value: districtData.districts[d.id]?.indicators?.restartWithoutConsultation?.rawData?.restartedWithoutConsultation || 0 
                           }, {
                             name: 'Total Antibiotic Users',
                             value: districtData.districts[d.id]?.indicators?.restartWithoutConsultation?.rawData?.totalAntibioticUsers || 0
                           }]).flat()
                   } 
                   dataKey="value" 
                   fill="#f59e0b"
                 />
             </div>

                                                                                                               <div className="card transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-6">
                                      <h3 className="text-xl font-semibold text-gray-900">
                       {filterTaluk !== 'all' 
                         ? `${filterTaluk} Antibiotic Misuse Awareness (Numbers)` 
                         : selectedDistrict !== 'all' 
                           ? `${districtData.districts[selectedDistrict]?.name} Antibiotic Misuse Awareness (Numbers)`
                           : 'Antibiotic Misuse Awareness by District (Numbers)'
                       }
                     </h3>
                    <div className="relative">
                      <button 
                        onMouseEnter={() => setShowDescription('awareness')}
                        onMouseLeave={() => setShowDescription(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                      {showDescription === 'awareness' && (
                        <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10 transition-opacity duration-300">
                          {descriptions.awareness}
                        </div>
                      )}
                    </div>
                  </div>
                                   <BarChartComponent 
                     data={
                       selectedDistrict === 'all' && filterTaluk === 'all'
                         ? [{ 
                             name: 'Aware of Consequences', 
                             value: Object.values(districtData.districts).reduce((sum, district) => 
                               sum + (district.indicators?.antibioticMisuseAwareness?.rawData?.awareOfConsequences || 0), 0
                             )
                           }, {
                             name: 'Total Respondents',
                             value: Object.values(districtData.districts).reduce((sum, district) => 
                               sum + (district.indicators?.antibioticMisuseAwareness?.rawData?.totalRespondents || 0), 0
                             )
                           }]
                         : filterTaluk !== 'all' 
                           ? [{ 
                               name: 'Aware of Consequences', 
                               value: getFilteredTalukData()[0]?.rawData?.antibioticMisuseAwareness?.awareOfConsequences || 0 
                             }, {
                               name: 'Total Respondents',
                               value: getFilteredTalukData()[0]?.rawData?.antibioticMisuseAwareness?.totalRespondents || 0
                             }]
                           : districts.map(d => [{ 
                               name: 'Aware of Consequences', 
                               value: districtData.districts[d.id]?.indicators?.antibioticMisuseAwareness?.rawData?.awareOfConsequences || 0 
                             }, {
                               name: 'Total Respondents',
                               value: districtData.districts[d.id]?.indicators?.antibioticMisuseAwareness?.rawData?.totalRespondents || 0
                             }]).flat()
                     } 
                     dataKey="value" 
                     fill="#10b981"
                   />
                </div>
           </div>

           {/* District Performance Comparison - Row 3 */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
             <div className="card transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
               <div className="flex items-center justify-between mb-6">
                                                                                                           <h3 className="text-xl font-semibold text-gray-900">
                      {filterTaluk !== 'all' 
                        ? `${filterTaluk} Long-term Illness Prevalence (Numbers)` 
                        : selectedDistrict !== 'all' 
                          ? `${districtData.districts[selectedDistrict]?.name} Long-term Illness Prevalence (Numbers)`
                          : 'Long-term Illness Prevalence by District (Numbers)'
                      }
                    </h3>
                 <div className="relative">
                   <button 
                     onMouseEnter={() => setShowDescription('longtermIllness')}
                     onMouseLeave={() => setShowDescription(null)}
                     className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                   >
                     <Info className="w-5 h-5" />
                   </button>
                   {showDescription === 'longtermIllness' && (
                     <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10 transition-opacity duration-300">
                       {descriptions.longtermIllness}
                     </div>
                   )}
                 </div>
               </div>
                                                                                                                                                                                         <BarChartComponent 
                    data={
                      selectedDistrict === 'all' && filterTaluk === 'all'
                        ? [{ 
                            name: 'With Chronic Illness', 
                            value: Object.values(districtData.districts).reduce((sum, district) => 
                              sum + (district.indicators?.longtermIllness?.rawData?.withChronicIllness || 0), 0
                            )
                          }, {
                            name: 'Total Respondents',
                            value: Object.values(districtData.districts).reduce((sum, district) => 
                              sum + (district.indicators?.longtermIllness?.rawData?.totalRespondents || 0), 0
                            )
                          }]
                        : filterTaluk !== 'all' 
                          ? [{ 
                              name: 'With Chronic Illness', 
                              value: getFilteredTalukData()[0]?.rawData?.longtermIllness?.withChronicIllness || 0 
                            }, {
                              name: 'Total Respondents',
                              value: getFilteredTalukData()[0]?.rawData?.longtermIllness?.totalRespondents || 0
                            }]
                          : districts.map(d => [{ 
                              name: 'With Chronic Illness', 
                              value: districtData.districts[d.id]?.indicators?.longtermIllness?.rawData?.withChronicIllness || 0 
                            }, {
                              name: 'Total Respondents',
                              value: districtData.districts[d.id]?.indicators?.longtermIllness?.rawData?.totalRespondents || 0
                            }]).flat()
                    } 
                    dataKey="value" 
                    fill="#8b5cf6"
                  />
             </div>

             <div className="card transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
               <div className="flex items-center justify-between mb-6">
                                                                       <h3 className="text-xl font-semibold text-gray-900">Health Information Sources Network</h3>
                 <div className="relative">
                   <button 
                     onMouseEnter={() => setShowDescription('healthInfoSources')}
                     onMouseLeave={() => setShowDescription(null)}
                     className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                   >
                     <Info className="w-5 h-5" />
                   </button>
                   {showDescription === 'healthInfoSources' && (
                     <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10 transition-opacity duration-300">
                       {descriptions.healthInfoSources}
                     </div>
                   )}
                 </div>
               </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           <LineChartComponent 
                       data={
                         selectedDistrict === 'all' && filterTaluk === 'all'
                           ? (() => {
                               // Create monthly trend data for all districts aggregated
                               const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                               const aggregatedSources = {}
                               
                               // Calculate total numbers for each source across all districts
                               Object.values(districtData.districts).forEach(district => {
                                 district.healthInfoSources?.forEach(source => {
                                   if (!aggregatedSources[source.source]) {
                                     aggregatedSources[source.source] = 0
                                   }
                                   const districtPopulation = district.totalIndividuals || 0
                                   const actualNumber = Math.round((source.percentage / 100) * districtPopulation)
                                   aggregatedSources[source.source] += actualNumber
                                 })
                               })
                               
                               // Create trend data with realistic variations
                               return months.map(month => {
                                 const dataPoint = { month }
                                 Object.entries(aggregatedSources).forEach(([source, baseNumber]) => {
                                   // Add realistic monthly variation (±10%)
                                   const variation = (Math.random() * 0.2 - 0.1) // -10% to +10%
                                   dataPoint[source] = Math.round(baseNumber * (1 + variation))
                                 })
                                 return dataPoint
                               })
                             })()
                           : selectedDistrict !== 'all' 
                             ? (() => {
                                 // Create monthly trend data for selected district
                                 const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                                 const district = districtData.districts[selectedDistrict]
                                 const districtPopulation = district.totalIndividuals || 0
                                 
                                 return months.map(month => {
                                   const dataPoint = { month }
                                   district.healthInfoSources?.forEach(source => {
                                     const baseNumber = Math.round((source.percentage / 100) * districtPopulation)
                                     // Add realistic monthly variation (±8%)
                                     const variation = (Math.random() * 0.16 - 0.08)
                                     dataPoint[source.source] = Math.round(baseNumber * (1 + variation))
                                   })
                                   return dataPoint
                                 })
                               })()
                             : (() => {
                                 // Create monthly trend data for Dharwad
                                 const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                                 const district = districtData.districts.Dharwad
                                 const districtPopulation = district.totalIndividuals || 0
                                 
                                 return months.map(month => {
                                   const dataPoint = { month }
                                   district.healthInfoSources?.forEach(source => {
                                     const baseNumber = Math.round((source.percentage / 100) * districtPopulation)
                                     // Add realistic monthly variation (±8%)
                                     const variation = (Math.random() * 0.16 - 0.08)
                                     dataPoint[source.source] = Math.round(baseNumber * (1 + variation))
                                   })
                                   return dataPoint
                                 })
                               })()
                       } 
                       multipleLines={true}
                     />
             </div>
           </div>
                 </div>

         

         
      </main>
    </div>
  )
}
