import { useState } from 'react'
import { dharwadData, getAllTaluks } from '../data/dharwadData'

export default function TestPage() {
  const [selectedTaluk, setSelectedTaluk] = useState('')
  const allTaluks = getAllTaluks()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Page - Dharwad Data</h1>
        
        {/* District Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">District Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{dharwadData.district.totalTaluks}</div>
              <div className="text-sm text-gray-600">Total Taluks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{dharwadData.district.totalPHCs}</div>
              <div className="text-sm text-gray-600">Total PHCs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{dharwadData.district.totalASHAs}</div>
              <div className="text-sm text-gray-600">Total ASHAs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{dharwadData.district.totalHouseholds.toLocaleString('en-US')}</div>
              <div className="text-sm text-gray-600">Total Households</div>
            </div>
          </div>
        </div>

        {/* Taluk Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select a Taluk</h2>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={selectedTaluk}
            onChange={(e) => setSelectedTaluk(e.target.value)}
          >
            <option value="">Choose a Taluk</option>
            {allTaluks.map(taluk => (
              <option key={taluk.id} value={taluk.id}>
                {taluk.name} ({taluk.phcCount} PHCs, {taluk.ashaCount} ASHAs)
              </option>
            ))}
          </select>
        </div>

        {/* Selected Taluk Details */}
        {selectedTaluk && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Selected Taluk Details</h2>
            {(() => {
              const taluk = dharwadData.taluks.find(t => t.id === selectedTaluk)
              if (!taluk) return <p>Taluk not found</p>
              
              return (
                <div>
                  <h3 className="text-lg font-medium mb-4">{taluk.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{taluk.phcCount}</div>
                      <div className="text-sm text-gray-600">PHCs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{taluk.ashaCount}</div>
                      <div className="text-sm text-gray-600">ASHAs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">{taluk.households.toLocaleString('en-US')}</div>
                      <div className="text-sm text-gray-600">Households</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-600">{taluk.population.toLocaleString('en-US')}</div>
                      <div className="text-sm text-gray-600">Population</div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-3">PHCs in this Taluk:</h4>
                  <div className="space-y-2">
                    {taluk.phcs.map(phc => (
                      <div key={phc.id} className="border border-gray-200 rounded p-3">
                        <div className="font-medium">{phc.name}</div>
                        <div className="text-sm text-gray-600">
                          {phc.ashaCount} ASHAs • {phc.households.toLocaleString('en-US')} Households
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* Navigation Links */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <div className="space-y-2">
            <a href="/" className="block text-blue-600 hover:text-blue-800">← Back to Main Dashboard</a>
            <a href="/taluk-dashboard" className="block text-blue-600 hover:text-blue-800">→ Go to Taluk Dashboard</a>
            <a href="/district-dashboard" className="block text-blue-600 hover:text-blue-800">→ Go to District Dashboard</a>
            <a href="/login" className="block text-blue-600 hover:text-blue-800">→ Go to Login</a>
          </div>
        </div>
      </div>
    </div>
  )
}
