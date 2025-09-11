// Dharwad District Data Structure
export const dharwadData = {
  // District Overview
  district: {
    name: "Dharwad",
    totalTaluks: 5,
    totalPHCs: 28,
    totalASHAs: 485,
    totalHouseholds: 245000,
    totalPopulation: 1847000
  },

  // Taluk-wise Data
  taluks: [
    {
      id: "dharwad-taluk",
      name: "Dharwad Taluk",
      phcCount: 6,
      ashaCount: 98,
      households: 52000,
      population: 392000,
      phcs: [
        {
          id: "phc-dharwad-1",
          name: "Dharwad PHC",
          ashaCount: 18,
          households: 9500,
          ashas: [
            { id: "asha-d1-1", name: "ASHA D1-1", households: 500, villages: ["Village A", "Village B"] },
            { id: "asha-d1-2", name: "ASHA D1-2", households: 480, villages: ["Village C", "Village D"] },
            { id: "asha-d1-3", name: "ASHA D1-3", households: 520, villages: ["Village E", "Village F"] },
            { id: "asha-d1-4", name: "ASHA D1-4", households: 450, villages: ["Village G", "Village H"] },
            { id: "asha-d1-5", name: "ASHA D1-5", households: 480, villages: ["Village I", "Village J"] }
          ]
        },
        {
          id: "phc-dharwad-2", 
          name: "Alnavar PHC",
          ashaCount: 16,
          households: 8200,
          ashas: [
            { id: "asha-d2-1", name: "ASHA D2-1", households: 450, villages: ["Alnavar", "Village E"] },
            { id: "asha-d2-2", name: "ASHA D2-2", households: 520, villages: ["Village F", "Village G"] },
            { id: "asha-d2-3", name: "ASHA D2-3", households: 480, villages: ["Village H", "Village I"] },
            { id: "asha-d2-4", name: "ASHA D2-4", households: 500, villages: ["Village J", "Village K"] }
          ]
        },
        {
          id: "phc-dharwad-3",
          name: "Annigeri PHC",
          ashaCount: 15,
          households: 7800,
          ashas: [
            { id: "asha-d3-1", name: "ASHA D3-1", households: 480, villages: ["Annigeri", "Village L"] },
            { id: "asha-d3-2", name: "ASHA D3-2", households: 520, villages: ["Village M", "Village N"] },
            { id: "asha-d3-3", name: "ASHA D3-3", households: 450, villages: ["Village O", "Village P"] },
            { id: "asha-d3-4", name: "ASHA D3-4", households: 500, villages: ["Village Q", "Village R"] }
          ]
        },
        {
          id: "phc-dharwad-4",
          name: "Naragund PHC",
          ashaCount: 17,
          households: 8900,
          ashas: [
            { id: "asha-d4-1", name: "ASHA D4-1", households: 520, villages: ["Naragund", "Village S"] },
            { id: "asha-d4-2", name: "ASHA D4-2", households: 480, villages: ["Village T", "Village U"] },
            { id: "asha-d4-3", name: "ASHA D4-3", households: 500, villages: ["Village V", "Village W"] },
            { id: "asha-d4-4", name: "ASHA D4-4", households: 450, villages: ["Village X", "Village Y"] }
          ]
        },
        {
          id: "phc-dharwad-5",
          name: "Gadag PHC",
          ashaCount: 16,
          households: 8400,
          ashas: [
            { id: "asha-d5-1", name: "ASHA D5-1", households: 480, villages: ["Gadag", "Village Z"] },
            { id: "asha-d5-2", name: "ASHA D5-2", households: 520, villages: ["Village AA", "Village BB"] },
            { id: "asha-d5-3", name: "ASHA D5-3", households: 450, villages: ["Village CC", "Village DD"] },
            { id: "asha-d5-4", name: "ASHA D5-4", households: 500, villages: ["Village EE", "Village FF"] }
          ]
        },
        {
          id: "phc-dharwad-6",
          name: "Ron PHC",
          ashaCount: 16,
          households: 8200,
          ashas: [
            { id: "asha-d6-1", name: "ASHA D6-1", households: 500, villages: ["Ron", "Village GG"] },
            { id: "asha-d6-2", name: "ASHA D6-2", households: 480, villages: ["Village HH", "Village II"] },
            { id: "asha-d6-3", name: "ASHA D6-3", households: 520, villages: ["Village JJ", "Village KK"] },
            { id: "asha-d6-4", name: "ASHA D6-4", households: 450, villages: ["Village LL", "Village MM"] }
          ]
        }
      ]
    },
    {
      id: "hubli-taluk",
      name: "Hubli Taluk", 
      phcCount: 8,
      ashaCount: 125,
      households: 68000,
      population: 512000,
      phcs: [
        {
          id: "phc-hubli-1",
          name: "Hubli PHC",
          ashaCount: 22,
          households: 12000,
          ashas: [
            { id: "asha-h1-1", name: "ASHA H1-1", households: 550, villages: ["Hubli Rural", "Village H"] },
            { id: "asha-h1-2", name: "ASHA H1-2", households: 480, villages: ["Village I", "Village J"] },
            { id: "asha-h1-3", name: "ASHA H1-3", households: 520, villages: ["Village K", "Village L"] },
            { id: "asha-h1-4", name: "ASHA H1-4", households: 450, villages: ["Village M", "Village N"] },
            { id: "asha-h1-5", name: "ASHA H1-5", households: 500, villages: ["Village O", "Village P"] }
          ]
        },
        {
          id: "phc-hubli-2",
          name: "Dharwad PHC",
          ashaCount: 18,
          households: 9500,
          ashas: [
            { id: "asha-h2-1", name: "ASHA H2-1", households: 480, villages: ["Dharwad", "Village Q"] },
            { id: "asha-h2-2", name: "ASHA H2-2", households: 520, villages: ["Village R", "Village S"] },
            { id: "asha-h2-3", name: "ASHA H2-3", households: 450, villages: ["Village T", "Village U"] },
            { id: "asha-h2-4", name: "ASHA H2-4", households: 500, villages: ["Village V", "Village W"] }
          ]
        }
      ]
    },
    {
      id: "kalghatgi-taluk",
      name: "Kalghatgi Taluk",
      phcCount: 4,
      ashaCount: 65,
      households: 32000,
      population: 241000,
      phcs: [
        {
          id: "phc-kalghatgi-1",
          name: "Kalghatgi PHC",
          ashaCount: 18,
          households: 9500,
          ashas: [
            { id: "asha-k1-1", name: "ASHA K1-1", households: 520, villages: ["Kalghatgi", "Village K"] },
            { id: "asha-k1-2", name: "ASHA K1-2", households: 480, villages: ["Village L", "Village M"] },
            { id: "asha-k1-3", name: "ASHA K1-3", households: 500, villages: ["Village N", "Village O"] },
            { id: "asha-k1-4", name: "ASHA K1-4", households: 450, villages: ["Village P", "Village Q"] }
          ]
        },
        {
          id: "phc-kalghatgi-2",
          name: "Savanur PHC",
          ashaCount: 16,
          households: 8200,
          ashas: [
            { id: "asha-k2-1", name: "ASHA K2-1", households: 480, villages: ["Savanur", "Village R"] },
            { id: "asha-k2-2", name: "ASHA K2-2", households: 520, villages: ["Village S", "Village T"] },
            { id: "asha-k2-3", name: "ASHA K2-3", households: 450, villages: ["Village U", "Village V"] },
            { id: "asha-k2-4", name: "ASHA K2-4", households: 500, villages: ["Village W", "Village X"] }
          ]
        }
      ]
    },
    {
      id: "kundgol-taluk",
      name: "Kundgol Taluk",
      phcCount: 5,
      ashaCount: 78,
      households: 38000,
      population: 286000,
      phcs: [
        {
          id: "phc-kundgol-1",
          name: "Kundgol PHC",
          ashaCount: 16,
          households: 8200,
          ashas: [
            { id: "asha-ku1-1", name: "ASHA Ku1-1", households: 500, villages: ["Kundgol", "Village N"] },
            { id: "asha-ku1-2", name: "ASHA Ku1-2", households: 520, villages: ["Village O", "Village P"] },
            { id: "asha-ku1-3", name: "ASHA Ku1-3", households: 480, villages: ["Village Q", "Village R"] },
            { id: "asha-ku1-4", name: "ASHA Ku1-4", households: 450, villages: ["Village S", "Village T"] }
          ]
        },
        {
          id: "phc-kundgol-2",
          name: "Mundargi PHC",
          ashaCount: 15,
          households: 7800,
          ashas: [
            { id: "asha-ku2-1", name: "ASHA Ku2-1", households: 480, villages: ["Mundargi", "Village U"] },
            { id: "asha-ku2-2", name: "ASHA Ku2-2", households: 520, villages: ["Village V", "Village W"] },
            { id: "asha-ku2-3", name: "ASHA Ku2-3", households: 450, villages: ["Village X", "Village Y"] },
            { id: "asha-ku2-4", name: "ASHA Ku2-4", households: 500, villages: ["Village Z", "Village AA"] }
          ]
        }
      ]
    },
    {
      id: "navalgund-taluk",
      name: "Navalgund Taluk",
      phcCount: 5,
      ashaCount: 119,
      households: 55000,
      population: 416000,
      phcs: [
        {
          id: "phc-navalgund-1",
          name: "Navalgund PHC",
          ashaCount: 20,
          households: 10500,
          ashas: [
            { id: "asha-n1-1", name: "ASHA N1-1", households: 520, villages: ["Navalgund", "Village Q"] },
            { id: "asha-n1-2", name: "ASHA N1-2", households: 480, villages: ["Village R", "Village S"] },
            { id: "asha-n1-3", name: "ASHA N1-3", households: 500, villages: ["Village T", "Village U"] },
            { id: "asha-n1-4", name: "ASHA N1-4", households: 450, villages: ["Village V", "Village W"] }
          ]
        },
        {
          id: "phc-navalgund-2",
          name: "Nargund PHC",
          ashaCount: 18,
          households: 9500,
          ashas: [
            { id: "asha-n2-1", name: "ASHA N2-1", households: 480, villages: ["Nargund", "Village X"] },
            { id: "asha-n2-2", name: "ASHA N2-2", households: 520, villages: ["Village Y", "Village Z"] },
            { id: "asha-n2-3", name: "ASHA N2-3", households: 450, villages: ["Village AA", "Village BB"] },
            { id: "asha-n2-4", name: "ASHA N2-4", households: 500, villages: ["Village CC", "Village DD"] }
          ]
        }
      ]
    }
  ],

  // Performance Data by Level
  performanceData: {
    district: {
      antibioticUsage: 68.5,
      selfMedication: 42.1,
      awareness: 65.4,
      completionRate: 71.2
    },
    taluk: {
      "dharwad-taluk": {
        antibioticUsage: 67.2,
        selfMedication: 41.8,
        awareness: 66.1,
        completionRate: 72.5,
                 rawData: {
           antibioticUsers: 2500,
           totalMedicineUsers: 3720,
           selfMedication: {
             withoutDoctor: 1045,
             totalAntibioticUsers: 2500
           },
           prescriptionData: {
             withPrescription: 1800,
             totalAntibioticUsers: 2500
           },
           completionData: {
             completedCourse: 1750,
             totalAntibioticUsers: 2500
           },
           restartData: {
             restartedWithoutConsultation: 725,
             totalAntibioticUsers: 2500
           },
           awarenessData: {
             awareOfConsequences: 1650,
             totalRespondents: 2500
           },
           pharmacyData: {
             pharmacySource: 420,
             selfRelativesSource: 380,
             withoutDoctor: 1045
           },
           incompleteData: {
             didNotComplete: 750,
             totalAntibioticUsers: 2500
           },
           strongMedicineData: {
             askedForStrong: 625,
             totalIndividuals: 3720
           },
           withoutHCPData: {
             tookWithoutHCP: 825,
             totalIndividuals: 3720
           },
           symptomsData: {
             fever: 1200,
             cough: 980,
             diarrhea: 450,
             other: 320
           },
           accessData: {
             couldNotGetMedicine: 185,
             totalIndividuals: 3720
           },
           longtermIllnessData: {
             withChronicIllness: 620,
             totalIllness: 3720
           },
           householdsVisited: {
             thisWeek: 850,
             lastWeek: 780,
             twoWeeksAgo: 720
           },
           episodeRate: {
             individualsWithAntibiotics: 2500,
             totalHouseholds: 52000
           }
         }
      },
      "hubli-taluk": {
        antibioticUsage: 69.8,
        selfMedication: 43.2,
        awareness: 64.8,
        completionRate: 70.1,
                 rawData: {
           antibioticUsers: 2800,
           totalMedicineUsers: 4010,
           selfMedication: {
             withoutDoctor: 1210,
             totalAntibioticUsers: 2800
           },
           prescriptionData: {
             withPrescription: 2100,
             totalAntibioticUsers: 2800
           },
           completionData: {
             completedCourse: 1960,
             totalAntibioticUsers: 2800
           },
           restartData: {
             restartedWithoutConsultation: 812,
             totalAntibioticUsers: 2800
           },
           awarenessData: {
             awareOfConsequences: 1814,
             totalRespondents: 2800
           },
           pharmacyData: {
             pharmacySource: 484,
             selfRelativesSource: 436,
             withoutDoctor: 1210
           },
           incompleteData: {
             didNotComplete: 840,
             totalAntibioticUsers: 2800
           },
           strongMedicineData: {
             askedForStrong: 721,
             totalIndividuals: 4010
           },
           withoutHCPData: {
             tookWithoutHCP: 963,
             totalIndividuals: 4010
           },
           symptomsData: {
             fever: 1344,
             cough: 1123,
             diarrhea: 481,
             other: 362
           },
           accessData: {
             couldNotGetMedicine: 200,
             totalIndividuals: 4010
           },
           longtermIllnessData: {
             withChronicIllness: 722,
             totalIllness: 4010
           },
           householdsVisited: {
             thisWeek: 950,
             lastWeek: 880,
             twoWeeksAgo: 820
           },
           episodeRate: {
             individualsWithAntibiotics: 2800,
             totalHouseholds: 68000
           }
         }
      },
      "kalghatgi-taluk": {
        antibioticUsage: 66.5,
        selfMedication: 40.9,
        awareness: 67.3,
        completionRate: 73.2,
                 rawData: {
           antibioticUsers: 2200,
           totalMedicineUsers: 3308,
           selfMedication: {
             withoutDoctor: 900,
             totalAntibioticUsers: 2200
           },
           prescriptionData: {
             withPrescription: 1650,
             totalAntibioticUsers: 2200
           },
           completionData: {
             completedCourse: 1606,
             totalAntibioticUsers: 2200
           },
           restartData: {
             restartedWithoutConsultation: 594,
             totalAntibioticUsers: 2200
           },
           awarenessData: {
             awareOfConsequences: 1481,
             totalRespondents: 2200
           },
           pharmacyData: {
             pharmacySource: 378,
             selfRelativesSource: 342,
             withoutDoctor: 900
           },
           incompleteData: {
             didNotComplete: 594,
             totalAntibioticUsers: 2200
           },
           strongMedicineData: {
             askedForStrong: 562,
             totalIndividuals: 3308
           },
           withoutHCPData: {
             tookWithoutHCP: 728,
             totalIndividuals: 3308
           },
           symptomsData: {
             fever: 1056,
             cough: 881,
             diarrhea: 396,
             other: 267
           },
           accessData: {
             couldNotGetMedicine: 165,
             totalIndividuals: 3308
           },
           longtermIllnessData: {
             withChronicIllness: 562,
             totalIllness: 3308
           },
           householdsVisited: {
             thisWeek: 720,
             lastWeek: 680,
             twoWeeksAgo: 640
           },
           episodeRate: {
             individualsWithAntibiotics: 2200,
             totalHouseholds: 32000
           }
         }
      },
      "kundgol-taluk": {
        antibioticUsage: 68.9,
        selfMedication: 42.5,
        awareness: 65.7,
        completionRate: 71.8,
                 rawData: {
           antibioticUsers: 2400,
           totalMedicineUsers: 3483,
           selfMedication: {
             withoutDoctor: 1020,
             totalAntibioticUsers: 2400
           },
           prescriptionData: {
             withPrescription: 1800,
             totalAntibioticUsers: 2400
           },
           completionData: {
             completedCourse: 1723,
             totalAntibioticUsers: 2400
           },
           restartData: {
             restartedWithoutConsultation: 696,
             totalAntibioticUsers: 2400
           },
           awarenessData: {
             awareOfConsequences: 1577,
             totalRespondents: 2400
           },
           pharmacyData: {
             pharmacySource: 408,
             selfRelativesSource: 372,
             withoutDoctor: 1020
           },
           incompleteData: {
             didNotComplete: 677,
             totalAntibioticUsers: 2400
           },
           strongMedicineData: {
             askedForStrong: 609,
             totalIndividuals: 3483
           },
           withoutHCPData: {
             tookWithoutHCP: 800,
             totalIndividuals: 3483
           },
           symptomsData: {
             fever: 1152,
             cough: 960,
             diarrhea: 432,
             other: 296
           },
           accessData: {
             couldNotGetMedicine: 174,
             totalIndividuals: 3483
           },
           longtermIllnessData: {
             withChronicIllness: 609,
             totalIllness: 3483
           },
           householdsVisited: {
             thisWeek: 780,
             lastWeek: 720,
             twoWeeksAgo: 680
           },
           episodeRate: {
             individualsWithAntibiotics: 2400,
             totalHouseholds: 38000
           }
         }
      },
      "navalgund-taluk": {
        antibioticUsage: 70.1,
        selfMedication: 44.1,
        awareness: 63.9,
        completionRate: 69.5,
                 rawData: {
           antibioticUsers: 2600,
           totalMedicineUsers: 3709,
           selfMedication: {
             withoutDoctor: 1147,
             totalAntibioticUsers: 2600
           },
           prescriptionData: {
             withPrescription: 1950,
             totalAntibioticUsers: 2600
           },
           completionData: {
             completedCourse: 1807,
             totalAntibioticUsers: 2600
           },
           restartData: {
             restartedWithoutConsultation: 767,
             totalAntibioticUsers: 2600
           },
           awarenessData: {
             awareOfConsequences: 1661,
             totalRespondents: 2600
           },
           pharmacyData: {
             pharmacySource: 459,
             selfRelativesSource: 413,
             withoutDoctor: 1147
           },
           incompleteData: {
             didNotComplete: 793,
             totalAntibioticUsers: 2600
           },
           strongMedicineData: {
             askedForStrong: 667,
             totalIndividuals: 3709
           },
           withoutHCPData: {
             tookWithoutHCP: 852,
             totalIndividuals: 3709
           },
           symptomsData: {
             fever: 1248,
             cough: 1040,
             diarrhea: 468,
             other: 312
           },
           accessData: {
             couldNotGetMedicine: 185,
             totalIndividuals: 3709
           },
           longtermIllnessData: {
             withChronicIllness: 667,
             totalIllness: 3709
           },
           householdsVisited: {
             thisWeek: 820,
             lastWeek: 760,
             twoWeeksAgo: 720
           },
           episodeRate: {
             individualsWithAntibiotics: 2600,
             totalHouseholds: 55000
           }
         }
      }
    }
  },

  // ASHA Performance Data (Sample)
  ashaPerformance: {
    "asha-d1-1": {
      householdsVisited: 450,
      averageTimePerHousehold: 12.5,
      individualsDataCollected: 2100,
      completeness: 85.2,
      prescriptionsScanned: 45,
      householdsWithSickness: 23.5,
      fullCourseCompletion: 78.9,
      pharmacySelfMedication: 15.2,
      wantToLearnMore: 82.1,
      antibioticsPrescribed: 12
    }
  },

  // PHC Performance Data (Sample)
  phcPerformance: {
    "phc-dharwad-1": {
      antibioticUsageRate: 68.5,
      selfMedicationRate: 42.1,
      prescriptionAvailability: 85.3,
      courseCompletionRate: 71.2,
      restartWithoutConsultation: 28.9,
      awarenessOfMisuse: 65.4,
      householdsVisited: 9500,
      episodeRate: 15.8,
      pharmacySelfSourcing: 18.2,
      incompleteCourses: 28.8,
      strongMedicineRequests: 12.5,
      antibioticsWithoutHCP: 22.1
    }
  }
}

// Helper functions for data access
export const getTalukData = (talukId) => {
  return dharwadData.taluks.find(taluk => taluk.id === talukId)
}

export const getPHCData = (phcId) => {
  for (const taluk of dharwadData.taluks) {
    const phc = taluk.phcs.find(phc => phc.id === phcId)
    if (phc) return { ...phc, talukName: taluk.name }
  }
  return null
}

export const getASHAData = (ashaId) => {
  for (const taluk of dharwadData.taluks) {
    for (const phc of taluk.phcs) {
      const asha = phc.ashas.find(asha => asha.id === ashaId)
      if (asha) return { ...asha, phcName: phc.name, talukName: taluk.name }
    }
  }
  return null
}

export const getAllTaluks = () => {
  return dharwadData.taluks.map(taluk => ({
    id: taluk.id,
    name: taluk.name,
    phcCount: taluk.phcCount,
    ashaCount: taluk.ashaCount,
    households: taluk.households,
    population: taluk.population
  }))
}

export const getAllPHCs = () => {
  const phcs = []
  dharwadData.taluks.forEach(taluk => {
    taluk.phcs.forEach(phc => {
      phcs.push({
        id: phc.id,
        name: phc.name,
        talukName: taluk.name,
        ashaCount: phc.ashaCount,
        households: phc.households
      })
    })
  })
  return phcs
}

export const getAllASHAs = () => {
  const ashas = []
  dharwadData.taluks.forEach(taluk => {
    taluk.phcs.forEach(phc => {
      phc.ashas.forEach(asha => {
        ashas.push({
          id: asha.id,
          name: asha.name,
          phcName: phc.name,
          talukName: taluk.name,
          households: asha.households,
          villages: asha.villages
        })
      })
    })
  })
  return ashas
}
