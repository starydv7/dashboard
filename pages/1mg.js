"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { useRouter } from 'next/router'
import { DashboardHeader } from '../components/Navigation'
import apiService from '../services/api'

export default function Tata1MgDashboard() {
  const router = useRouter()
  
  // User data state
  const [userData, setUserData] = useState(null)
  
  // Tab navigation
  const [activeTab, setActiveTab] = useState("resistance"); // "resistance" or "isolation"
  
  // Dashboard filters
  const [district, setDistrict] = useState("BENGALURU URBAN");
  const [testName, setTestName] = useState("CULTURE AEROBIC BLOOD (AUTOMATED), ADULT");
  const [organism, setOrganism] = useState(""); // user selects organism
  const [viewMode, setViewMode] = useState("monthly");
  
  // Isolation dashboard state
  const [isolationFilters, setIsolationFilters] = useState({
    district: "",
    organism_isolated: "",
    test_name: ""
  });
  const [isolationData, setIsolationData] = useState({
    totalIsolates: [],
    isolationByDistrict: [],
    isolationByTest: [],
    monthlyTrend: [],
    yearlyTrend: [],
    topOrganisms: [],
    topDistricts: []
  });
  const [isolationLoading, setIsolationLoading] = useState(false);
  
  // Dropdown options
  const [districts, setDistricts] = useState([])
  const [testNames, setTestNames] = useState([])
  const [organisms, setOrganisms] = useState([])

  // raw API result
  const [rawData, setRawData] = useState([]);
  // aggregated for charts
  const [topAntibiotics, setTopAntibiotics] = useState([]);
  const [trendSeries, setTrendSeries] = useState([]); // array of { antibiotic, data: [{period: Date, resistant_percent: number, total_test}] }

  // selected antibiotics (from bar chart)
  const [selectedAntibiotics, setSelectedAntibiotics] = useState([]);

  // svg refs
  const barRef = useRef(null);
  const lineRef = useRef(null);
  const isolationBarRef = useRef(null);

  useEffect(() => {
    // Get user data from localStorage
    if (typeof window !== 'undefined') {
      const userDataString = localStorage.getItem('userData')
      if (userDataString) {
        try {
          setUserData(JSON.parse(userDataString))
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }
    }
    
    // Fetch dropdown options
    const fetchDropdownOptions = async () => {
      try {
        const [districtsData, testNamesData, organismsData] = await Promise.all([
          apiService.getDistricts(),
          apiService.getTestNames(),
          apiService.getOrganisms()
        ])
        console.log('🌍 Districts from API:', districtsData)
        console.log('🧪 Test Names from API:', testNamesData)
        console.log('🧬 Organisms from API:', organismsData)
        setDistricts(districtsData || [])
        setTestNames(testNamesData || [])
        setOrganisms(organismsData || [])
      } catch (error) {
        console.error('Error fetching dropdown options:', error)
      }
    }
    
    fetchDropdownOptions()
  }, [])

  // ------------------------
  // Data transformation - useCallback for optimization
  // ------------------------
  const prepareChartsFromApi = useCallback((apiArray) => {
    if (!Array.isArray(apiArray)) {
      setTopAntibiotics([]);
      setTrendSeries([]);
      return;
    }

    // 1) Top antibiotics by total tests (sum total_test)
    const byAntibiotic = d3.rollups(
      apiArray,
      v => d3.sum(v, d => Number(d.total_test) || 0),
      d => (d.antibiotic || "").trim()
    );
    // filter out blank antibiotic entries if you want
    const filtered = byAntibiotic
      .filter(([ant, sum]) => ant && ant !== "" && ant.toLowerCase() !== "no growth")
      .map(([ant, sum]) => ({ antibiotic: ant, total_tests: sum }))
      .sort((a, b) => b.total_tests - a.total_tests);

    setTopAntibiotics(filtered.slice(0, 12)); // top 12

    // 2) For lines: group by antibiotic -> for each antibiotic build sorted series over time (period as Date)
    const grouped = d3.groups(
      apiArray.filter(d => d.antibiotic && d.antibiotic.trim() !== ""),
      d => d.antibiotic.trim()
    );

    const series = grouped.map(([antibiotic, rows]) => {
      const points = rows
        .map(r => {
          // Use 'year' field for yearly view, 'month' for monthly
          const periodSource = r.year || r.month;
          const period = new Date(periodSource);
          const resistant_percent = Number(r.resistant_percent ?? r.resistant ?? 0);
          // choose to read resistant_percent if present, otherwise compute: resistant/total_test*100
          const total_test = Number(r.total_test || 0);
          let rp = resistant_percent;
          if (isNaN(rp) || rp === 0) {
            if (total_test > 0 && (r.resistant || r.resistant === 0)) {
              rp = (Number(r.resistant || 0) / total_test) * 100;
            } else rp = 0;
          }
          return { period, resistant_percent: rp, total_test };
        })
        .sort((a, b) => a.period - b.period);
      return { antibiotic, data: points };
    });

    setTrendSeries(series);
    // default select top 3 antibiotics
    setSelectedAntibiotics(series.slice(0, 3).map(s => s.antibiotic));
  }, [viewMode]) // Add viewMode as dependency

  // ------------------------
  // Isolation API Methods
  // ------------------------
  const fetchIsolationFilters = useCallback(async () => {
    try {
      console.log('🔍 Fetching isolation filters from API...');
      const response = await fetch('http://192.168.3.74:3000/api/v1/dashboard/filters');
      const data = await response.json();
      console.log('📋 Isolation Filters API Response:', data);
      console.log('📋 Available Districts:', data.districts || data.district_list || []);
      console.log('📋 Available Organisms:', data.organisms || data.organism_list || []);
      console.log('📋 Available Test Names:', data.testNames || data.test_names || data.test_list || []);
      return data;
    } catch (error) {
      console.error('❌ Error fetching isolation filters:', error);
      return { districts: [], organisms: [], testNames: [] };
    }
  }, []);

  const fetchIsolationData = useCallback(async (filters) => {
    setIsolationLoading(true);
    try {
      console.log('🔄 Fetching isolation data with filters:', filters);
      const baseUrl = 'http://192.168.3.74:3000/api/v1/dashboard';
      const params = new URLSearchParams();
      
      if (filters.district) params.append('district', filters.district);
      if (filters.organism_isolated) params.append('organism_isolated', filters.organism_isolated);
      if (filters.test_name) params.append('test_name', filters.test_name);

      console.log('🌐 API URLs being called:');
      console.log(`📊 Total Isolates: ${baseUrl}/total?${params}`);
      console.log(`🏥 Isolation by District: ${baseUrl}/isolation-district?${params}`);
      console.log(`🧪 Isolation by Test: ${baseUrl}/test?${params}`);
      console.log(`📈 Monthly Trend: ${baseUrl}/monthly-isolation?${params}`);
      console.log(`📈 Yearly Trend: ${baseUrl}/yearly-isolation?${params}`);
      console.log(`🦠 Top Organisms: ${baseUrl}/top-organisms-isolated`);
      console.log(`🏥 Top Districts: ${baseUrl}/top-districts`);

      const [totalIsolates, isolationByDistrict, isolationByTest, monthlyTrend, yearlyTrend, topOrganisms, topDistricts] = await Promise.all([
        fetch(`${baseUrl}/total?${params}`).then(r => r.json()),
        fetch(`${baseUrl}/isolation-district?${params}`).then(r => r.json()),
        fetch(`${baseUrl}/test?${params}`).then(r => r.json()),
        fetch(`${baseUrl}/monthly-isolation?${params}`).then(r => r.json()),
        fetch(`${baseUrl}/yearly-isolation?${params}`).then(r => r.json()),
        fetch(`${baseUrl}/top-organisms-isolated`).then(r => r.json()),
        fetch(`${baseUrl}/top-districts`).then(r => r.json())
      ]);

      console.log('📊 API Response Data:');
      console.log('📊 Total Isolates:', totalIsolates);
      console.log('🏥 Isolation by District:', isolationByDistrict);
                    console.log('🧪 Isolation by Test:', isolationByTest);
                    console.log('🧪 Sample Types Data Structure:', isolationByTest);
                    console.log('🧪 Available Test Names:', isolationByTest?.map(item => item.test_name || item.name));
                    console.log('🧪 Total Tests per Sample Type:', isolationByTest?.map(item => ({
                      sampleType: item.test_name || item.name,
                      totalTests: item.total_isolations || item.total_test || item.count
                    })));
      console.log('📈 Monthly Trend:', monthlyTrend);
      console.log('📈 Yearly Trend:', yearlyTrend);
      console.log('🦠 Top Organisms:', topOrganisms);
      console.log('🏥 Top Districts:', topDistricts);

      setIsolationData({
        totalIsolates,
        isolationByDistrict,
        isolationByTest,
        monthlyTrend,
        yearlyTrend,
        topOrganisms,
        topDistricts
      });
    } catch (error) {
      console.error('❌ Error fetching isolation data:', error);
    } finally {
      setIsolationLoading(false);
    }
  }, []);

  // ------------------------
  // Fetch API - useCallback to prevent unnecessary re-renders
  // ------------------------
  const fetchDashboard = useCallback(async () => {
    try {
      // call service
      const res = await apiService.getDashboardData({
        district,
        test_name: testName,
        organism,
        viewMode,
      });

      // res expected: array of objects like your screenshot:
      // { month: "2024-01-31T18:30:00.000Z", organism: "...", antibiotic: "...", sensitive: 0, resistant: 0, total_test: 6, sensitive_percent: "0.00", resistant_percent: "0.00" }
      setRawData(res);
      prepareChartsFromApi(res);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  }, [district, testName, organism, viewMode, prepareChartsFromApi])

  // Auto-fetch when filters change
  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  // Fetch isolation filters on component mount
  useEffect(() => {
    console.log('🚀 Component mounted, fetching isolation filters...');
    fetchIsolationFilters();
  }, [fetchIsolationFilters]);

  // Fetch isolation data when tab changes to isolation
  useEffect(() => {
    if (activeTab === "isolation") {
      console.log('🔬 Switching to isolation tab, fetching data...');
      fetchIsolationData(isolationFilters);
    }
  }, [activeTab, isolationFilters, fetchIsolationData]);

  // Log current state for debugging
  useEffect(() => {
    console.log('📊 Current Isolation State:');
    console.log('📊 Active Tab:', activeTab);
    console.log('📊 Isolation Filters:', isolationFilters);
    console.log('📊 Isolation Data:', isolationData);
    console.log('📊 Isolation Loading:', isolationLoading);
    console.log('📊 Available Districts:', districts);
    console.log('📊 Available Organisms:', organisms);
    console.log('📊 Available Test Names:', testNames);
  }, [activeTab, isolationFilters, isolationData, isolationLoading, districts, organisms, testNames]);

  // ------------------------
  // D3: draw bar chart (Top antibiotics)
  // ------------------------
  useEffect(() => {
    if (!topAntibiotics || topAntibiotics.length === 0) {
      d3.select(barRef.current).selectAll("*").remove();
      return;
    }

    const svg = d3.select(barRef.current);
    svg.selectAll("*").remove();

    const width = 1000;
    const height = 450;
    const margin = { top: 50, right: 50, bottom: 140, left: 100 };

    svg.attr("width", width).attr("height", height);

    const x = d3
      .scaleBand()
      .domain(topAntibiotics.map(d => d.antibiotic))
      .range([margin.left, width - margin.right])
      .padding(0.25);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(topAntibiotics, d => d.total_tests) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // x axis with better styling - prevent overlap
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "10px")
      .attr("dx", "-.5em")
      .attr("dy", ".5em");

    // x axis label
    svg
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height - 10})`)
      .style("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .text("Antibiotics");

    // y axis with better styling
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "11px");

    // y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 25)
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .text("Total Tests");

    // bars
    svg
      .selectAll(".bar")
      .data(topAntibiotics)
      .join("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.antibiotic))
      .attr("y", d => y(d.total_tests))
      .attr("width", x.bandwidth())
      .attr("height", d => Math.max(0, height - margin.bottom - y(d.total_tests)))
      .attr("fill", d => (selectedAntibiotics.includes(d.antibiotic) ? "#1E40AF" : "#60A5FA"))
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        // toggle selection
        const el = d.antibiotic;
        setSelectedAntibiotics(prev => (prev.includes(el) ? prev.filter(x => x !== el) : [...prev, el]));
      });

    // bar labels (value)
    svg
      .selectAll(".label")
      .data(topAntibiotics)
      .join("text")
      .attr("x", d => x(d.antibiotic) + x.bandwidth() / 2)
      .attr("y", d => y(d.total_tests) - 6)
      .attr("text-anchor", "middle")
      .attr("font-size", 11)
      .text(d => d.total_tests);

  }, [topAntibiotics, selectedAntibiotics]);

  // ------------------------
  // D3: draw multi-line chart for selected antibiotics
  // ------------------------
  useEffect(() => {
    if (!trendSeries || trendSeries.length === 0 || selectedAntibiotics.length === 0) {
      d3.select(lineRef.current).selectAll("*").remove();
      return;
    }

    // pick series for selected antibiotics
    const chosen = trendSeries.filter(s => selectedAntibiotics.includes(s.antibiotic));
    if (chosen.length === 0) {
      d3.select(lineRef.current).selectAll("*").remove();
      return;
    }

    const svg = d3.select(lineRef.current);
    svg.selectAll("*").remove();

    const width = 1200;
    const height = 550;
    const margin = { top: 50, right: 250, bottom: 120, left: 90 };
    svg.attr("width", width).attr("height", height);

    // all unique periods (sorted)
    const allPeriods = Array.from(new Set(chosen.flatMap(s => s.data.map(d => +d.period))))
      .map(n => new Date(n))
      .sort((a, b) => a - b);

    // x scale time
    const x = d3.scaleTime().domain(d3.extent(allPeriods)).range([margin.left, width - margin.right]);

    // y scale percent (0..100)
    const yMax = d3.max(chosen.flatMap(s => s.data.map(p => p.resistant_percent))) || 100;
    const y = d3.scaleLinear().domain([0, Math.max(10, yMax)]).nice().range([height - margin.bottom, margin.top]);

    // axes with better styling - prevent overlap
    const xAxis = d3.axisBottom(x).ticks(Math.min(8, allPeriods.length)).tickFormat(d3.timeFormat("%b %Y"));
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-35)")
      .style("text-anchor", "end")
      .style("font-size", "10px")
      .attr("dx", "-.5em")
      .attr("dy", ".35em");

    // x axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom + 40)
      .style("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .text("Time Period");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d => d + "%"))
      .selectAll("text")
      .style("font-size", "11px");

    // y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 30)
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .text("Resistance %");

    // color scale
    const color = d3.scaleOrdinal(d3.schemeSet2).domain(chosen.map(c => c.antibiotic));

    // line generator
    const lineGen = d3
      .line()
      .defined(d => d.resistant_percent !== null && !isNaN(d.resistant_percent))
      .x(d => x(d.period))
      .y(d => y(d.resistant_percent));

    // draw lines
    svg
      .selectAll(".series")
      .data(chosen)
      .join("g")
      .attr("class", "series")
      .each(function (series, index) {
        d3.select(this)
          .append("path")
          .datum(series.data)
          .attr("fill", "none")
          .attr("stroke", color(series.antibiotic))
          .attr("stroke-width", 2.2)
          .attr("d", lineGen);

        // last value label - with better positioning to prevent overlap
        const last = series.data[series.data.length - 1];
        if (last) {
          const labelSpacing = 18; // spacing between labels
          const yPosition = y(last.resistant_percent) + (index * labelSpacing) - ((chosen.length - 1) * labelSpacing / 2);
          
          d3.select(this)
            .append("text")
            .attr("x", width - margin.right + 10)
            .attr("y", yPosition)
            .attr("dy", "0.35em")
            .attr("font-size", "11px")
            .attr("fill", color(series.antibiotic))
            .attr("font-weight", "500")
            .text(series.antibiotic.length > 20 ? series.antibiotic.substring(0, 17) + '...' : series.antibiotic);
        }
      });

    // Tooltip circle & hover (optional)
    const tooltip = d3.select("body").append("div").attr("class", "d3-tooltip").style("position", "absolute").style("pointer-events", "none").style("padding", "6px 8px").style("background", "rgba(0,0,0,0.7)").style("color", "#fff").style("border-radius", "4px").style("font-size", "12px").style("display", "none");

    svg
      .selectAll(".dot")
      .data(chosen.flatMap(series => series.data.map(d => ({ antibiotic: series.antibiotic, ...d }))))
      .join("circle")
      .attr("cx", d => x(d.period))
      .attr("cy", d => y(d.resistant_percent))
      .attr("r", 3)
      .attr("fill", d => color(d.antibiotic))
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block").html(`<strong>${d.antibiotic}</strong><br/>${d3.timeFormat("%Y-%m")(d.period)}<br/>Resistant: ${d.resistant_percent.toFixed(2)}%<br/>N=${d.total_test}`);
      })
      .on("mousemove", event => {
        tooltip.style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 20) + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"));

  }, [trendSeries, selectedAntibiotics]);

  // ------------------------
  // D3: draw isolation bar chart (Top organisms)
  // ------------------------
                useEffect(() => {
                  if (!isolationData.topOrganisms || isolationData.topOrganisms.length === 0) {
                    d3.select(isolationBarRef.current).selectAll("*").remove();
                    return;
                  }

                  console.log('📊 Drawing isolation bar chart with data:', isolationData.topOrganisms);

                  const svg = d3.select(isolationBarRef.current);
                  svg.selectAll("*").remove();

                  const width = 1200; // Increased from 1000
                  const height = 700; // Increased slightly from 650
                  const margin = { top: 60, right: 80, bottom: 180, left: 120 }; // Reverted margins

                  svg.attr("width", width).attr("height", height);

    // Prepare data - use all top 10 organisms (including "no growth" variants)
    const filteredData = isolationData.topOrganisms.slice(0, 10);
    
    // Calculate total for percentage calculation
    const totalTests = filteredData.reduce((sum, d) => sum + Number(d.total_isolations || 0), 0);
    
    // Add percentage to each data point
    const dataWithPercentages = filteredData.map(d => ({
      ...d,
      total_isolations: Number(d.total_isolations || 0),
      percentage: totalTests > 0 ? ((Number(d.total_isolations || 0) / totalTests) * 100).toFixed(2) : 0
    }));

    console.log('📊 Processed organisms data:', dataWithPercentages);
    console.log('📊 Total tests for percentage calculation:', totalTests);

    const x = d3
      .scaleBand()
      .domain(dataWithPercentages.map(d => d.organism_isolated || 'Unknown'))
      .range([margin.left, width - margin.right])
      .padding(0.25);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(dataWithPercentages, d => d.total_isolations) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // x axis with better styling - prevent overlap
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-60)") // Increased rotation for better readability
      .style("text-anchor", "end")
      .style("font-size", "11px") // Increased font size
      .attr("dx", "-.5em")
      .attr("dy", ".5em");

    // x axis label
    svg
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height - 20})`) // Moved up to prevent cutting
      .style("text-anchor", "middle")
      .style("font-size", "14px") // Increased font size
      .style("font-weight", "bold")
      .text("Organisms");

    // y axis with better styling
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px"); // Increased font size

    // y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 30) // Moved to prevent cutting
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .style("font-size", "14px") // Increased font size
      .style("font-weight", "bold")
      .text("Sum of Total_Test");

    // bars
    svg
      .selectAll(".isolation-bar")
      .data(dataWithPercentages)
      .join("rect")
      .attr("class", "isolation-bar")
      .attr("x", d => x(d.organism_isolated || 'Unknown'))
      .attr("y", d => y(d.total_isolations))
      .attr("width", x.bandwidth())
      .attr("height", d => Math.max(0, height - margin.bottom - y(d.total_isolations)))
      .attr("fill", "#87CEEB") // Sky blue color to match your Python plot
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        // Highlight bar
        d3.select(this).attr("fill", "#4682B4");
        
        // Show tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "isolation-tooltip")
          .style("position", "absolute")
          .style("pointer-events", "none")
          .style("padding", "10px 14px") // Increased padding
          .style("background", "rgba(0,0,0,0.9)") // Darker background
          .style("color", "#fff")
          .style("border-radius", "6px") // Increased border radius
          .style("font-size", "13px") // Increased font size
          .style("z-index", "1000")
          .style("max-width", "300px") // Added max width
          .style("word-wrap", "break-word") // Added word wrap
          .html(`
            <strong>${d.organism_isolated || 'Unknown'}</strong><br/>
            Total Isolations: ${d.total_isolations.toLocaleString()}<br/>
            Percentage: ${d.percentage}%
          `);
      })
      .on("mousemove", function(event) {
        d3.select(".isolation-tooltip")
          .style("left", (event.pageX + 15) + "px") // Increased offset
          .style("top", (event.pageY - 25) + "px"); // Increased offset
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "#87CEEB");
        d3.select(".isolation-tooltip").remove();
      });

    // percentage labels above bars (like in your Python plot)
    svg
      .selectAll(".isolation-percentage")
      .data(dataWithPercentages)
      .join("text")
      .attr("class", "isolation-percentage")
      .attr("x", d => x(d.organism_isolated || 'Unknown') + x.bandwidth() / 2)
      .attr("y", d => y(d.total_isolations) - 15) // Increased from -10
      .attr("text-anchor", "middle")
      .attr("font-size", "12px") // Increased from 11px
      .attr("font-weight", "500")
      .attr("fill", "#333")
      .text(d => `${d.percentage}%`);

  }, [isolationData.topOrganisms]);

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userData')
    localStorage.removeItem('accessToken')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="🧫 Antibiotic Resistance Dashboard" 
        subtitle="1mg Integration - Advanced healthcare analytics"
        showNavigation={true}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🧫 1mg Healthcare Analytics Dashboard
            </h1>
            {userData && (
              <p className="text-gray-600">
                Welcome, {userData.name}! This advanced analytics dashboard is accessible to all users.
              </p>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("resistance")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "resistance"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  🧫 Antibiotic Resistance
                </button>
                <button
                  onClick={() => setActiveTab("isolation")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "isolation"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  🔬 Isolation Analysis
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "resistance" && (
            <>
              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filter Options</h2>
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">District</label>
                    <select 
                      value={district} 
                      onChange={(e) => setDistrict(e.target.value)} 
                      className="border border-gray-300 p-2 rounded-md w-48"
                    >
                      <option value="">All Districts</option>
                      {districts.map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Test Name</label>
                    <select 
                      value={testName} 
                      onChange={(e) => setTestName(e.target.value)} 
                      className="border border-gray-300 p-2 rounded-md w-96"
                    >
                      <option value="">All Tests</option>
                      {testNames.map((t, i) => (
                        <option key={i} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Organism</label>
                    <select 
                      value={organism} 
                      onChange={(e) => setOrganism(e.target.value)} 
                      className="border border-gray-300 p-2 rounded-md w-48"
                    >
                      <option value="">All Organisms</option>
                      {organisms.map((o, i) => (
                        <option key={i} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">View Mode</label>
                    <select 
                      value={viewMode} 
                      onChange={e => setViewMode(e.target.value)} 
                      className="border border-gray-300 p-2 rounded-md w-32"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="px-6 py-2 bg-green-50 text-green-700 rounded-md font-medium text-center border border-green-200">
                      ✓ Auto-updating on selection
                    </div>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  📊 Top Antibiotics by Sample Count (Click to Toggle Selection)
                </h2>
                <div className="w-full">
                  <svg ref={barRef} className="w-full" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  💡 Click on bars to select/deselect antibiotics for trend analysis
                </p>
              </div>

              {/* Line Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  📈 {viewMode === "monthly" ? "Monthly" : "Yearly"} Resistance Trends
                </h2>
                <div className="w-full">
                  <svg ref={lineRef} className="w-full" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  💡 Hover over data points to see detailed information
                </p>
              </div>

              {/* Raw Data Preview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <details className="cursor-pointer">
                  <summary className="text-lg font-semibold text-gray-900 mb-4">
                    📋 Raw API Response (Preview)
                  </summary>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(rawData, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            </>
          )}

          {activeTab === "isolation" && (
            <>
              {/* Isolation Analysis Content */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🔬 Isolation Analysis Dashboard</h2>
                <p className="text-gray-600 mb-6">
                  Comprehensive analysis of bacterial isolation patterns, growth rates, and contamination trends.
                </p>
                
                {/* Isolation Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">District</label>
                    <select 
                      value={isolationFilters.district}
                      onChange={(e) => {
                        console.log('🏥 District changed to:', e.target.value);
                        setIsolationFilters(prev => ({ ...prev, district: e.target.value }));
                      }}
                      className="border border-gray-300 p-2 rounded-md"
                    >
                      <option value="">All Districts</option>
                      {districts.map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Organism Isolated</label>
                    <select 
                      value={isolationFilters.organism_isolated}
                      onChange={(e) => {
                        console.log('🦠 Organism changed to:', e.target.value);
                        setIsolationFilters(prev => ({ ...prev, organism_isolated: e.target.value }));
                      }}
                      className="border border-gray-300 p-2 rounded-md"
                    >
                      <option value="">All Organisms</option>
                      {organisms.map((o, i) => (
                        <option key={i} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Test Name</label>
                    <select 
                      value={isolationFilters.test_name}
                      onChange={(e) => {
                        console.log('🧪 Test Name changed to:', e.target.value);
                        setIsolationFilters(prev => ({ ...prev, test_name: e.target.value }));
                      }}
                      className="border border-gray-300 p-2 rounded-md"
                    >
                      <option value="">All Tests</option>
                      {testNames.map((t, i) => (
                        <option key={i} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {isolationLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading isolation data...</span>
                  </div>
                )}
              </div>

              {/* Isolation Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">📊</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Isolates</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {isolationData.totalIsolates?.length > 0 
                          ? isolationData.totalIsolates.reduce((sum, item) => sum + (item.count || 0), 0).toLocaleString()
                          : '0'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm font-bold">🏥</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Districts Covered</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {isolationData.isolationByDistrict?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-sm font-bold">🧪</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Test Types</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {isolationData.isolationByTest?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm font-bold">🦠</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Top Organisms</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {isolationData.topOrganisms?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Organisms Bar Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-[1100px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">📊 Sum of Total_Test for Top 10 Organisms</h3>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">API Endpoint:</span> /top-organisms-isolated
                  </div>
                </div>
                
                {/* Parameters Info */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 Chart Parameters:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-blue-800">
                    <div><strong>Data Source:</strong> {isolationData.topOrganisms?.length > 0 ? 'API Data Available' : 'No Data'}</div>
                    <div><strong>Includes:</strong> All top 10 (including "no growth" variants)</div>
                    <div><strong>Field Used:</strong> total_isolations</div>
                  </div>
                  <div className="mt-2 text-xs text-blue-700">
                    <strong>Actual Data Format:</strong> {`{organism_isolated: "string", total_isolations: "string"}`}
                  </div>
                  <div className="mt-1 text-xs text-blue-600">
                    <strong>Percentage Calculation:</strong> 100 * total_isolations_i / sum(all 10)
                  </div>
                </div>

                <div className="w-full h-[900px]">
                  <svg ref={isolationBarRef} className="w-full h-full" />
                </div>
         
              </div>

              {/* Additional Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Monthly Isolation Trends</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    {isolationData.monthlyTrend?.length > 0 ? (
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Monthly trend data available</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {isolationData.monthlyTrend.length} data points
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">No monthly trend data available</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🏥 Isolation by District</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    {isolationData.isolationByDistrict?.length > 0 ? (
                      <div className="text-center">
                        <p className="text-sm text-gray-600">District data available</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {isolationData.isolationByDistrict.length} districts
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">No district data available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Top Isolated Organisms */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🦠 Top 10 Isolated Organisms</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organism</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Isolation Count</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isolationData.topOrganisms?.length > 0 ? (
                        isolationData.topOrganisms.slice(0, 10).map((organism, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {organism.organism_isolated || organism.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {organism.count?.toLocaleString() || organism.total || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {organism.percentage ? `${organism.percentage}%` : 'N/A'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                            No organism data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Districts */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🏥 Top 10 Districts by Test Volume</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Volume</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isolationData.topDistricts?.length > 0 ? (
                        isolationData.topDistricts.slice(0, 10).map((district, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {district.district || district.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {district.count?.toLocaleString() || district.total || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {district.percentage ? `${district.percentage}%` : 'N/A'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                            No district data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Raw Data Preview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <details className="cursor-pointer">
                  <summary className="text-lg font-semibold text-gray-900 mb-4">
                    📋 Raw Isolation Data (Preview)
                  </summary>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(isolationData, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            </>
          )}

          {/* Quick Access to All Dashboards */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Dashboard Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/asha-dashboard')}
                className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-left transition-colors"
              >
                <h4 className="font-semibold text-green-900">👩‍⚕️ ASHA Dashboard</h4>
                <p className="text-sm text-green-700">Individual ASHA worker metrics</p>
              </button>
              
              <button
                onClick={() => router.push('/taluk-dashboard')}
                className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-left transition-colors"
              >
                <h4 className="font-semibold text-blue-900">🏥 Taluk Dashboard</h4>
                <p className="text-sm text-blue-700">PHC and taluk-level data</p>
              </button>
              
              <button
                onClick={() => router.push('/district-dashboard')}
                className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-left transition-colors"
              >
                <h4 className="font-semibold text-purple-900">🗺️ District Dashboard</h4>
                <p className="text-sm text-purple-700">District-level analytics</p>
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-end">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
