export const districtData = {
  // District Selection Data
  selectedDistrict: 'Dharwad', // Default selected district
  
  // District-wise Data Structure
  districts: {
    'Dharwad': {
      name: 'Dharwad District',
      code: 'DHW',
      totalHouseholds: 15420,
      totalIndividuals: 67890,
      activeASHAs: 245,
      lastUpdated: '2024-01-15T10:30:00Z',
      
      // Core Indicators for this district
      indicators: {
        antibioticUsage: {
          current: 68.5,
          previous: 72.3,
          change: -3.8,
          trend: 'decreasing',
          target: 60.0,
          description: 'Share of medicine users taking antibiotics across selected taluks in the district',
          rawData: {
            antibioticUsers: 4650,
            totalMedicineUsers: 6789
          }
        },
        selfMedication: {
          current: 42.1,
          previous: 45.8,
          change: -3.7,
          trend: 'decreasing',
          target: 30.0,
          description: 'How many antibiotic users get them without a doctor\'s consultation',
          rawData: {
            withoutDoctor: 1955,
            totalAntibioticUsers: 4650
          }
        },
        restartWithoutConsultation: {
          current: 28.9,
          previous: 31.2,
          change: -2.3,
          trend: 'decreasing',
          target: 20.0,
          description: 'How often people restart antibiotics without medical advice',
          rawData: {
            restartedWithoutConsultation: 1344,
            totalAntibioticUsers: 4650
          }
        },
        antibioticMisuseAwareness: {
          current: 65.4,
          previous: 58.7,
          change: 6.7,
          trend: 'increasing',
          target: 80.0,
          description: 'How much people know about the dangers of antibiotic misuse',
          rawData: {
            awareOfConsequences: 4438,
            totalRespondents: 6789
          }
        },
        longtermIllness: {
          current: 23.6,
          previous: 22.1,
          change: 1.5,
          trend: 'increasing',
          target: 20.0,
          description: 'Burden of chronic illnesses in the district',
          rawData: {
            withChronicIllness: 1602,
            totalRespondents: 6789
          }
        }
      },

      // Taluk-wise breakdown within this district
      talukData: [
        { 
          name: 'Dharwad Taluk', 
          antibioticUsage: 71.2, 
          selfMedication: 44.8, 
          awareness: 67.3,
          households: 3920,
          population: 15680,
          ashaCount: 62,
          rawData: {
            antibioticUsers: 1115,
            totalMedicineUsers: 1568,
            selfMedication: {
              withoutDoctor: 500,
              totalAntibioticUsers: 1115
            },
            restartWithoutConsultation: {
              restartedWithoutConsultation: 322,
              totalAntibioticUsers: 1115
            },
            antibioticMisuseAwareness: {
              awareOfConsequences: 1055,
              totalRespondents: 1568
            },
            longtermIllness: {
              withChronicIllness: 370,
              totalRespondents: 1568
            }
          }
        },
        { 
          name: 'Hubli Taluk', 
          antibioticUsage: 66.8, 
          selfMedication: 39.5, 
          awareness: 63.1,
          households: 5120,
          population: 20480,
          ashaCount: 80,
          rawData: {
            antibioticUsers: 1368,
            totalMedicineUsers: 2048,
            selfMedication: {
              withoutDoctor: 540,
              totalAntibioticUsers: 1368
            },
            restartWithoutConsultation: {
              restartedWithoutConsultation: 410,
              totalAntibioticUsers: 1368
            },
            antibioticMisuseAwareness: {
              awareOfConsequences: 1292,
              totalRespondents: 2048
            },
            longtermIllness: {
              withChronicIllness: 518,
              totalRespondents: 2048
            }
          }
        },
        { 
          name: 'Kalghatgi Taluk', 
          antibioticUsage: 69.1, 
          selfMedication: 41.2, 
          awareness: 65.8,
          households: 2410,
          population: 9640,
          ashaCount: 38,
          rawData: {
            antibioticUsers: 666,
            totalMedicineUsers: 964,
            selfMedication: {
              withoutDoctor: 274,
              totalAntibioticUsers: 666
            },
            restartWithoutConsultation: {
              restartedWithoutConsultation: 185,
              totalAntibioticUsers: 666
            },
            antibioticMisuseAwareness: {
              awareOfConsequences: 634,
              totalRespondents: 964
            },
            longtermIllness: {
              withChronicIllness: 228,
              totalRespondents: 964
            }
          }
        },
        { 
          name: 'Kundgol Taluk', 
          antibioticUsage: 67.3, 
          selfMedication: 42.8, 
          awareness: 64.2,
          households: 2860,
          population: 11440,
          ashaCount: 45,
          rawData: {
            antibioticUsers: 770,
            totalMedicineUsers: 1144,
            selfMedication: {
              withoutDoctor: 330,
              totalAntibioticUsers: 770
            },
            restartWithoutConsultation: {
              restartedWithoutConsultation: 220,
              totalAntibioticUsers: 770
            },
            antibioticMisuseAwareness: {
              awareOfConsequences: 735,
              totalRespondents: 1144
            },
            longtermIllness: {
              withChronicIllness: 270,
              totalRespondents: 1144
            }
          }
        },
        { 
          name: 'Navalgund Taluk', 
          antibioticUsage: 68.9, 
          selfMedication: 43.1,
          awareness: 66.5,
          rawData: {
            antibioticUsers: 731,
            totalMedicineUsers: 1065,
            selfMedication: {
              withoutDoctor: 315,
              totalAntibioticUsers: 731
            },
            restartWithoutConsultation: {
              restartedWithoutConsultation: 207,
              totalAntibioticUsers: 731
            },
            antibioticMisuseAwareness: {
              awareOfConsequences: 722,
              totalRespondents: 1065
            },
            longtermIllness: {
              withChronicIllness: 216,
              totalRespondents: 1065
            }
          },
          households: 1110,
          population: 4440,
          ashaCount: 20
        }
      ],

      // Monthly trends for this district
      monthlyTrends: [
        { month: 'Jan', antibioticUsage: 72.3, selfMedication: 45.8, awareness: 58.7 },
        { month: 'Feb', antibioticUsage: 71.1, selfMedication: 44.2, awareness: 60.1 },
        { month: 'Mar', antibioticUsage: 70.5, selfMedication: 43.8, awareness: 61.3 },
        { month: 'Apr', antibioticUsage: 69.8, selfMedication: 43.1, awareness: 62.7 },
        { month: 'May', antibioticUsage: 69.2, selfMedication: 42.5, awareness: 63.9 },
        { month: 'Jun', antibioticUsage: 68.5, selfMedication: 42.1, awareness: 65.4 }
      ],

             // Health information sources for this district
       healthInfoSources: [
         { source: 'ASHA Workers', percentage: 35.2 },
         { source: 'Lab Assistant', percentage: 25.8 },
         { source: 'Hospital PHC', percentage: 22.3 },
         { source: 'Personal', percentage: 16.7 }
       ]
    },

    'Belgaum': {
      name: 'Belgaum District',
      code: 'BLG',
      totalHouseholds: 18250,
      totalIndividuals: 82340,
      activeASHAs: 298,
      lastUpdated: '2024-01-15T10:30:00Z',
      
      indicators: {
        antibioticUsage: {
          current: 71.2,
          previous: 74.1,
          change: -2.9,
          trend: 'decreasing',
          target: 60.0,
          description: 'Share of medicine users taking antibiotics across selected taluks in the district'
        },
        selfMedication: {
          current: 45.3,
          previous: 48.7,
          change: -3.4,
          trend: 'decreasing',
          target: 30.0,
          description: 'How many antibiotic users get them without a doctor\'s consultation'
        },
        restartWithoutConsultation: {
          current: 31.8,
          previous: 34.2,
          change: -2.4,
          trend: 'decreasing',
          target: 20.0,
          description: 'How often people restart antibiotics without medical advice'
        },
        antibioticMisuseAwareness: {
          current: 58.9,
          previous: 52.3,
          change: 6.6,
          trend: 'increasing',
          target: 80.0,
          description: 'How much people know about the dangers of antibiotic misuse'
        },
        longtermIllness: {
          current: 26.4,
          previous: 24.8,
          change: 1.6,
          trend: 'increasing',
          target: 20.0,
          description: 'Burden of chronic illnesses in the district'
        }
      },

      talukData: [
        { name: 'Belgaum Taluk', antibioticUsage: 73.1, selfMedication: 47.2, awareness: 59.8, households: 4560, population: 18240, ashaCount: 74 },
        { name: 'Chikodi Taluk', antibioticUsage: 69.8, selfMedication: 43.1, awareness: 57.2, households: 3650, population: 14600, ashaCount: 60 },
        { name: 'Athani Taluk', antibioticUsage: 70.5, selfMedication: 45.8, awareness: 58.9, households: 3120, population: 12480, ashaCount: 52 },
        { name: 'Raibag Taluk', antibioticUsage: 71.4, selfMedication: 44.7, awareness: 59.3, households: 2920, population: 11680, ashaCount: 48 },
        { name: 'Gokak Taluk', antibioticUsage: 69.2, selfMedication: 46.1, awareness: 58.1, households: 4000, population: 16000, ashaCount: 64 }
      ],

      monthlyTrends: [
        { month: 'Jan', antibioticUsage: 74.1, selfMedication: 48.7, awareness: 52.3 },
        { month: 'Feb', antibioticUsage: 73.5, selfMedication: 47.8, awareness: 54.1 },
        { month: 'Mar', antibioticUsage: 72.9, selfMedication: 47.2, awareness: 55.8 },
        { month: 'Apr', antibioticUsage: 72.3, selfMedication: 46.5, awareness: 57.2 },
        { month: 'May', antibioticUsage: 71.8, selfMedication: 45.9, awareness: 58.6 },
        { month: 'Jun', antibioticUsage: 71.2, selfMedication: 45.3, awareness: 58.9 }
      ],

             healthInfoSources: [
         { source: 'ASHA Workers', percentage: 38.5 },
         { source: 'Lab Assistant', percentage: 28.2 },
         { source: 'Hospital PHC', percentage: 24.1 },
         { source: 'Personal', percentage: 9.2 }
       ]
    },

    'Haveri': {
      name: 'Haveri District',
      code: 'HVR',
      totalHouseholds: 12890,
      totalIndividuals: 56780,
      activeASHAs: 198,
      lastUpdated: '2024-01-15T10:30:00Z',
      
      indicators: {
        antibioticUsage: {
          current: 65.8,
          previous: 68.9,
          change: -3.1,
          trend: 'decreasing',
          target: 60.0,
          description: 'Share of medicine users taking antibiotics across selected taluks in the district'
        },
        selfMedication: {
          current: 38.7,
          previous: 41.2,
          change: -2.5,
          trend: 'decreasing',
          target: 30.0,
          description: 'How many antibiotic users get them without a doctor\'s consultation'
        },
        restartWithoutConsultation: {
          current: 25.4,
          previous: 27.8,
          change: -2.4,
          trend: 'decreasing',
          target: 20.0,
          description: 'How often people restart antibiotics without medical advice'
        },
        antibioticMisuseAwareness: {
          current: 69.2,
          previous: 62.1,
          change: 7.1,
          trend: 'increasing',
          target: 80.0,
          description: 'How much people know about the dangers of antibiotic misuse'
        },
        longtermIllness: {
          current: 20.8,
          previous: 19.5,
          change: 1.3,
          trend: 'increasing',
          target: 20.0,
          description: 'Burden of chronic illnesses in the district'
        }
      },

      talukData: [
        { name: 'Haveri Taluk', antibioticUsage: 67.2, selfMedication: 39.8, awareness: 70.1, households: 3220, population: 12880, ashaCount: 50 },
        { name: 'Shiggaon Taluk', antibioticUsage: 64.5, selfMedication: 37.2, awareness: 68.9, households: 2580, population: 10320, ashaCount: 40 },
        { name: 'Savanur Taluk', antibioticUsage: 66.1, selfMedication: 38.9, awareness: 69.5, households: 2410, population: 9640, ashaCount: 38 },
        { name: 'Hangal Taluk', antibioticUsage: 65.3, selfMedication: 39.1, awareness: 68.7, households: 2340, population: 9360, ashaCount: 36 },
        { name: 'Byadgi Taluk', antibioticUsage: 65.9, selfMedication: 38.5, awareness: 69.8, households: 2340, population: 9360, ashaCount: 34 }
      ],

      monthlyTrends: [
        { month: 'Jan', antibioticUsage: 68.9, selfMedication: 41.2, awareness: 62.1 },
        { month: 'Feb', antibioticUsage: 68.2, selfMedication: 40.8, awareness: 63.5 },
        { month: 'Mar', antibioticUsage: 67.6, selfMedication: 40.1, awareness: 64.9 },
        { month: 'Apr', antibioticUsage: 67.1, selfMedication: 39.5, awareness: 66.2 },
        { month: 'May', antibioticUsage: 66.5, selfMedication: 39.0, awareness: 67.8 },
        { month: 'Jun', antibioticUsage: 65.8, selfMedication: 38.7, awareness: 69.2 }
      ],

             healthInfoSources: [
         { source: 'ASHA Workers', percentage: 42.1 },
         { source: 'Lab Assistant', percentage: 23.4 },
         { source: 'Hospital PHC', percentage: 20.8 },
         { source: 'Personal', percentage: 13.7 }
       ]
    }
  },

  // Helper function to get current district data
  getCurrentDistrictData: function() {
    return this.districts[this.selectedDistrict] || this.districts['Dharwad'];
  },

  // Helper function to get all districts for comparison
  getAllDistricts: function() {
    return Object.keys(this.districts).map(key => ({
      code: this.districts[key].code,
      name: this.districts[key].name,
      selected: key === this.selectedDistrict
    }));
  }
}
