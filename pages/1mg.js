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
  
  // Dashboard filters
  const [district, setDistrict] = useState("BENGALURU URBAN");
  const [testName, setTestName] = useState("CULTURE AEROBIC BLOOD (AUTOMATED), ADULT");
  const [organism, setOrganism] = useState(""); // user selects organism
  const [viewMode, setViewMode] = useState("monthly");
  
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
    const margin = { top: 50, right: 250, bottom: 100, left: 90 };
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
      .attr("transform", `translate(${width / 2}, ${height - 15})`)
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
              🧫 Antibiotic Resistance Dashboard
            </h1>
            {userData && (
              <p className="text-gray-600">
                Welcome, {userData.name}! This advanced analytics dashboard is accessible to all users.
              </p>
            )}
          </div>

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
