import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function LineChartComponent({ data = [], dataKey, stroke = "#3b82f6", multipleLines = false, isAreaChart = false, fill = "#3b82f6", fillOpacity = 0.3 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  if (isAreaChart) {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={stroke} 
            fill={fill}
            fillOpacity={fillOpacity}
            strokeWidth={2} 
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        {multipleLines ? (
          <>
            <Line type="monotone" dataKey="ASHA Workers" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="Lab Assistant" stroke="#f59e0b" strokeWidth={2} />
            <Line type="monotone" dataKey="Hospital PHC" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="Personal" stroke="#8b5cf6" strokeWidth={2} />
          </>
        ) : (
          <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2} />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function BarChartComponent({ data = [], dataKey, fill = "#3b82f6" }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill={fill}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function PieChartComponent({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ source, percentage }) => `${source}: ${percentage}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="percentage"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}
