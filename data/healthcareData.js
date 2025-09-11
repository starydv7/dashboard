// Additional healthcare data for government dashboard charts

export const healthcareData = {
  // Epidemiological Trend Data
  epidemiologicalTrends: [
    { month: 'Jan', antibioticUsage: 72.3, selfMedication: 45.8, awareness: 58.7 },
    { month: 'Feb', antibioticUsage: 71.1, selfMedication: 44.2, awareness: 60.1 },
    { month: 'Mar', antibioticUsage: 70.5, selfMedication: 43.8, awareness: 61.3 },
    { month: 'Apr', antibioticUsage: 69.8, selfMedication: 43.1, awareness: 62.7 },
    { month: 'May', antibioticUsage: 69.2, selfMedication: 42.5, awareness: 63.9 },
    { month: 'Jun', antibioticUsage: 68.5, selfMedication: 42.1, awareness: 65.4 }
  ],

  // Core Indicators (Based on your comprehensive list)
  coreIndicators: {
    // 1. Antibiotic Usage Prevalence (Q10)
    antibioticUsagePrevalence: {
      district: 69.2,
      talukWise: {
        'Dharwad Taluk': 72.3,
        'Hubli Taluk': 68.5,
        'Kalghatgi Taluk': 71.8,
        'Kundgol Taluk': 65.4,
        'Navalgund Taluk': 67.9
      },
      formula: "(Number of individuals who took antibiotics / Total number of Individuals who took any medicine) * 100",
      description: "Share of medicine users taking antibiotics across selected taluks in the district"
    },

    // 2. Self-Medication Rate (Q19 and Q31)
    selfMedicationRate: {
      district: 42.5,
      talukWise: {
        'Dharwad Taluk': 45.8,
        'Hubli Taluk': 38.2,
        'Kalghatgi Taluk': 48.7,
        'Kundgol Taluk': 41.3,
        'Navalgund Taluk': 39.6
      },
      formula: "(Antibiotic users who did not consult a doctor / Total Number of Antibiotic Users) * 100",
      description: "How many antibiotic users get them without a doctor's consultation",
      rawData: {
        selfMedicated: 1250,
        total: 2940
      }
    },

    // 5. Percentage of people restarted medication without consultation (Q22)
    medicationRestartRate: {
      district: 28.7,
      talukWise: {
        'Dharwad Taluk': 31.2,
        'Hubli Taluk': 25.8,
        'Kalghatgi Taluk': 34.5,
        'Kundgol Taluk': 27.3,
        'Navalgund Taluk': 24.9
      },
      formula: "(Individuals who restarted antibiotics without consultation / Total Antibiotic users) * 100",
      description: "How often people restart antibiotics without medical advice"
    },

    // 7. Awareness of Antibiotic Misuse (Q24, Q25)
    antibioticMisuseAwareness: {
      district: 63.9,
      talukWise: {
        'Dharwad Taluk': 68.5,
        'Hubli Taluk': 72.3,
        'Kalghatgi Taluk': 58.7,
        'Kundgol Taluk': 61.4,
        'Navalgund Taluk': 59.8
      },
      formula: "(Individuals aware of consequences of Misuse / Total Respondents) * 100",
      description: "How much people know about the dangers of antibiotic misuse"
    },

    // 10. Prevalence of Long-term illness (Q15)
    longTermIllnessPrevalence: {
      district: 18.7,
      talukWise: {
        'Dharwad Taluk': 16.3,
        'Hubli Taluk': 20.1,
        'Kalghatgi Taluk': 22.8,
        'Kundgol Taluk': 17.5,
        'Navalgund Taluk': 19.2
      },
      formula: "(Individuals with chronic illness / Total Respondents) * 100",
      description: "Burden of chronic illnesses in the district"
    }
  },

  // 11. Source of Health Information (Q3)
  healthInformationSources: [
    { source: 'Government Health Workers (ASHA/ANM)', frequency: 45.2, percentage: 45.2 },
    { source: 'Private Doctors', frequency: 28.7, percentage: 28.7 },
    { source: 'Family/Friends', frequency: 12.3, percentage: 12.3 },
    { source: 'Television/Radio', frequency: 8.5, percentage: 8.5 },
    { source: 'Internet/Social Media', frequency: 3.2, percentage: 3.2 },
    { source: 'Newspapers/Magazines', frequency: 2.1, percentage: 2.1 }
  ],

  // Risk Assessment Data
  riskAssessment: [
    { indicator: 'Antibiotic Resistance', value: 75 },
    { indicator: 'Self-Medication', value: 42 },
    { indicator: 'Incomplete Treatment', value: 29 },
    { indicator: 'Poor Awareness', value: 35 },
    { indicator: 'Healthcare Access', value: 68 },
    { indicator: 'Infrastructure Gap', value: 45 }
  ],

  // Population Health Distribution
  populationHealth: [
    { taluk: 'Taluk A', healthy: 65, atRisk: 20, sick: 15 },
    { taluk: 'Taluk B', healthy: 58, atRisk: 25, sick: 17 },
    { taluk: 'Taluk C', healthy: 62, atRisk: 22, sick: 16 },
    { taluk: 'Taluk D', healthy: 55, atRisk: 28, sick: 17 }
  ],

  // Population Distribution by Taluk (for pie charts)
  populationDistribution: [
    { name: 'Dharwad Taluk', value: 392000, households: 78400, ashaCount: 245 },
    { name: 'Hubli Taluk', value: 512000, households: 102400, ashaCount: 320 },
    { name: 'Kalghatgi Taluk', value: 241000, households: 48200, ashaCount: 150 },
    { name: 'Kundgol Taluk', value: 286000, households: 57200, ashaCount: 180 },
    { name: 'Navalgund Taluk', value: 416000, households: 83200, ashaCount: 260 }
  ],

  // Age-wise Population Distribution
  ageDistribution: [
    { ageGroup: '0-5 years', population: 125000, percentage: 18.4 },
    { ageGroup: '6-14 years', population: 185000, percentage: 27.2 },
    { ageGroup: '15-59 years', population: 285000, percentage: 42.0 },
    { ageGroup: '60+ years', population: 85000, percentage: 12.4 }
  ],

  // Gender-wise Population Distribution
  genderDistribution: [
    { gender: 'Male', population: 340000, percentage: 50.1 },
    { gender: 'Female', population: 340000, percentage: 49.9 }
  ],

  // Healthcare Access Data
  healthcareAccess: [
    { distance: 2, access: 85, name: 'Village A' },
    { distance: 5, access: 72, name: 'Village B' },
    { distance: 8, access: 65, name: 'Village C' },
    { distance: 12, access: 58, name: 'Village D' },
    { distance: 15, access: 45, name: 'Village E' },
    { distance: 20, access: 35, name: 'Village F' }
  ],

  // Treatment Compliance Funnel
  treatmentCompliance: [
    { stage: 'Prescribed', percentage: 100 },
    { stage: 'Started Treatment', percentage: 85 },
    { stage: 'Completed Course', percentage: 71 },
    { stage: 'Follow-up Done', percentage: 58 },
    { stage: 'Full Recovery', percentage: 52 }
  ],

  // Seasonal Health Patterns
  seasonalPatterns: [
    { month: 'Jan', respiratory: 45, gastrointestinal: 25, fever: 30 },
    { month: 'Feb', respiratory: 42, gastrointestinal: 28, fever: 30 },
    { month: 'Mar', respiratory: 38, gastrointestinal: 32, fever: 30 },
    { month: 'Apr', respiratory: 35, gastrointestinal: 35, fever: 30 },
    { month: 'May', respiratory: 32, gastrointestinal: 38, fever: 30 },
    { month: 'Jun', respiratory: 40, gastrointestinal: 30, fever: 30 }
  ],

  // Healthcare Infrastructure
  infrastructure: [
    { taluk: 'Taluk A', phc: 8, subcenter: 45, asha: 120 },
    { taluk: 'Taluk B', phc: 6, subcenter: 38, asha: 95 },
    { taluk: 'Taluk C', phc: 7, subcenter: 42, asha: 110 },
    { taluk: 'Taluk D', phc: 5, subcenter: 35, asha: 85 }
  ],

  // Disease Burden by Category
  diseaseBurden: [
    { category: 'Respiratory', cases: 1250, percentage: 35 },
    { category: 'Gastrointestinal', cases: 890, percentage: 25 },
    { category: 'Fever/Malaria', cases: 720, percentage: 20 },
    { category: 'Skin Diseases', cases: 450, percentage: 12 },
    { category: 'Others', cases: 300, percentage: 8 }
  ],

  // Healthcare Quality Indicators
  qualityIndicators: [
    { indicator: 'Patient Satisfaction', score: 78 },
    { indicator: 'Treatment Success Rate', score: 85 },
    { indicator: 'Infection Control', score: 92 },
    { indicator: 'Staff Training', score: 75 },
    { indicator: 'Equipment Availability', score: 68 },
    { indicator: 'Emergency Response', score: 82 }
  ],

  // Budget Allocation
  budgetAllocation: [
    { category: 'Medicines', amount: 45, color: '#3b82f6' },
    { category: 'Infrastructure', amount: 25, color: '#10b981' },
    { category: 'Staff Salaries', amount: 20, color: '#f59e0b' },
    { category: 'Training', amount: 5, color: '#ef4444' },
    { category: 'Others', amount: 5, color: '#8b5cf6' }
  ],

  // Performance Metrics by Month
  performanceMetrics: [
    { month: 'Jan', antibioticUsage: 72.3, awareness: 58.7, compliance: 65.2 },
    { month: 'Feb', antibioticUsage: 71.1, awareness: 60.1, compliance: 67.8 },
    { month: 'Mar', antibioticUsage: 70.5, awareness: 61.3, compliance: 69.1 },
    { month: 'Apr', antibioticUsage: 69.8, awareness: 62.7, compliance: 70.3 },
    { month: 'May', antibioticUsage: 69.2, awareness: 63.9, compliance: 71.5 },
    { month: 'Jun', antibioticUsage: 68.5, awareness: 65.4, compliance: 72.8 }
  ],

  // Taluk-wise Detailed Population Data
  talukPopulationDetails: {
    'Dharwad Taluk': {
      totalPopulation: 392000,
      households: 78400,
      ashaCount: 245,
      phcCount: 12,
      villages: 156,
      literacyRate: 78.5,
      healthcareAccess: 85
    },
    'Hubli Taluk': {
      totalPopulation: 512000,
      households: 102400,
      ashaCount: 320,
      phcCount: 15,
      villages: 198,
      literacyRate: 82.3,
      healthcareAccess: 92
    },
    'Kalghatgi Taluk': {
      totalPopulation: 241000,
      households: 48200,
      ashaCount: 150,
      phcCount: 8,
      villages: 95,
      literacyRate: 72.1,
      healthcareAccess: 68
    },
    'Kundgol Taluk': {
      totalPopulation: 286000,
      households: 57200,
      ashaCount: 180,
      phcCount: 10,
      villages: 112,
      literacyRate: 75.8,
      healthcareAccess: 72
    },
    'Navalgund Taluk': {
      totalPopulation: 416000,
      households: 83200,
      ashaCount: 260,
      phcCount: 13,
      villages: 165,
      literacyRate: 79.2,
      healthcareAccess: 78
    }
  }
}
