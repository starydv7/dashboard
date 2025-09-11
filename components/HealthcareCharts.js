import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, ScatterChart, 
  Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

// 1. Epidemiological Trend Chart (Line + Area)
export function EpidemiologicalTrendChart({ data, title = "Disease Trend Analysis" }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="antibioticUsage" 
            stackId="1" 
            stroke="#3b82f6" 
            fill="#3b82f6" 
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="selfMedication" 
            stackId="1" 
            stroke="#ef4444" 
            fill="#ef4444" 
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// 2. Healthcare Performance Dashboard (Composed Chart)
export function HealthcarePerformanceChart({ data, title = "Healthcare Performance Metrics" }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="antibioticUsage" fill="#3b82f6" />
          <Line yAxisId="right" type="monotone" dataKey="awareness" stroke="#10b981" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// 3. Risk Assessment Radar Chart
export function RiskAssessmentChart({ data, title = "Health Risk Assessment" }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="indicator" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Radar 
            name="Current Risk Level" 
            dataKey="value" 
            stroke="#ef4444" 
            fill="#ef4444" 
            fillOpacity={0.3} 
          />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

// 4. Population Health Distribution (Stacked Bar)
export function PopulationHealthChart({ data, title = "Population Health Distribution" }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="taluk" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="healthy" stackId="a" fill="#10b981" />
          <Bar dataKey="atRisk" stackId="a" fill="#f59e0b" />
          <Bar dataKey="sick" stackId="a" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// 5. Healthcare Access Scatter Plot
export function HealthcareAccessChart({ data, title = "Healthcare Access vs Distance" }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="distance" name="Distance (km)" />
          <YAxis type="number" dataKey="access" name="Access Score" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Healthcare Centers" dataKey="access" fill="#3b82f6" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

// 6. Treatment Compliance Funnel Chart
export function TreatmentComplianceChart({ data, title = "Treatment Compliance Funnel" }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.stage} className="flex items-center">
            <div className="w-32 text-sm font-medium text-gray-600">{item.stage}</div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-6">
                <div 
                  className="bg-blue-600 h-6 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
            <div className="w-16 text-sm font-semibold text-gray-900">{item.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 7. Seasonal Health Pattern Chart
export function SeasonalHealthChart({ data, title = "Seasonal Health Patterns" }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="respiratory" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="gastrointestinal" stroke="#10b981" strokeWidth={2} />
          <Line type="monotone" dataKey="fever" stroke="#f59e0b" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// 8. Healthcare Infrastructure Map (Bar Chart)
export function InfrastructureChart({ data, title = "Healthcare Infrastructure by Taluk" }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="taluk" type="category" width={80} />
          <Tooltip />
          <Legend />
          <Bar dataKey="phc" fill="#3b82f6" name="Primary Health Centers" />
          <Bar dataKey="subcenter" fill="#10b981" name="Sub Centers" />
          <Bar dataKey="asha" fill="#f59e0b" name="ASHA Workers" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
