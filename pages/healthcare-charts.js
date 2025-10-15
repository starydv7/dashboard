import { useRouter } from 'next/router'
import { healthcareData } from '../data/healthcareData'
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
import { PieChartComponent, BarChartComponent } from '../components/Chart'
import { DashboardHeader } from '../components/Navigation'
import { LogOut } from 'lucide-react'

export default function HealthcareChartsPage() {
  const router = useRouter()

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('userRole')
    localStorage.removeItem('userData')
    localStorage.removeItem('accessToken')
    
    // Redirect to login page
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <DashboardHeader 
        title="Healthcare Analytics Dashboard" 
        subtitle="Comprehensive Health Indicators for Government Officials"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Section 1: Epidemiological Analysis */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Epidemiological Analysis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EpidemiologicalTrendChart 
              data={healthcareData.epidemiologicalTrends} 
              title="Disease Trend Analysis"
            />
            <HealthcarePerformanceChart 
              data={healthcareData.performanceMetrics} 
              title="Healthcare Performance Metrics"
            />
          </div>
        </div>

        {/* Section 2: Risk Assessment & Population Health */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Assessment & Population Health</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskAssessmentChart 
              data={healthcareData.riskAssessment} 
              title="Health Risk Assessment"
            />
            <PopulationHealthChart 
              data={healthcareData.populationHealth} 
              title="Population Health Distribution by Taluk"
            />
          </div>
        </div>

        {/* Section 3: Healthcare Access & Infrastructure */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Healthcare Access & Infrastructure</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HealthcareAccessChart 
              data={healthcareData.healthcareAccess} 
              title="Healthcare Access vs Distance"
            />
            <InfrastructureChart 
              data={healthcareData.infrastructure} 
              title="Healthcare Infrastructure by Taluk"
            />
          </div>
        </div>

        {/* Section 4: Treatment Compliance & Seasonal Patterns */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Treatment Compliance & Seasonal Patterns</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TreatmentComplianceChart 
              data={healthcareData.treatmentCompliance} 
              title="Treatment Compliance Funnel"
            />
            <SeasonalHealthChart 
              data={healthcareData.seasonalPatterns} 
              title="Seasonal Health Patterns"
            />
          </div>
        </div>

        {/* Section 5: Disease Burden & Quality Indicators */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Disease Burden & Quality Indicators</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Disease Burden by Category</h3>
              <PieChartComponent data={healthcareData.diseaseBurden} />
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Healthcare Quality Indicators</h3>
              <BarChartComponent 
                data={healthcareData.qualityIndicators} 
                dataKey="score" 
                fill="#10b981"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Budget Allocation */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Budget Allocation</h2>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Healthcare Budget Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <PieChartComponent data={healthcareData.budgetAllocation} />
              </div>
              <div className="space-y-3">
                {healthcareData.budgetAllocation.map((item, index) => (
                  <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.amount}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="metric-card">
            <h3 className="text-sm font-medium text-gray-600">Total Cases</h3>
            <div className="metric-value">3,610</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </div>
          <div className="metric-card">
            <h3 className="text-sm font-medium text-gray-600">Recovery Rate</h3>
            <div className="metric-value">85.2%</div>
            <p className="text-xs text-gray-500 mt-1">Average</p>
          </div>
          <div className="metric-card">
            <h3 className="text-sm font-medium text-gray-600">Infrastructure Score</h3>
            <div className="metric-value">78.5%</div>
            <p className="text-xs text-gray-500 mt-1">Overall rating</p>
          </div>
          <div className="metric-card">
            <h3 className="text-sm font-medium text-gray-600">Patient Satisfaction</h3>
            <div className="metric-value">82.3%</div>
            <p className="text-xs text-gray-500 mt-1">Survey results</p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8">
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
