import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import {
  MapPin, Thermometer, Droplets, Wind, Sun, Cloud, CloudRain, AlertTriangle, Download,
  Menu, X, Home, History, FileText, Map, Users, Shield,
  Sprout, Zap, Leaf, Settings, Wifi, Gauge, Send, Phone, Mail,
  Plus, Edit, Save,
} from 'lucide-react';

// --- Mock Data Generators ---
const generateRealisticWeatherData = () => ({
  location: 'Chennai, Tamil Nadu, India',
  coordinates: { lat: 13.0827, lng: 80.2707 },
  temperature: Math.round(28 + Math.random() * 8),
  condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain'][Math.floor(Math.random() * 5)],
  humidity: Math.round(60 + Math.random() * 25),
  wind: Math.round(8 + Math.random() * 12),
  windDirection: 'SW',
  pressure: Math.round(1010 + Math.random() * 20),
  uvIndex: Math.round(3 + Math.random() * 8),
  rainfall: Math.round(Math.random() * 15),
  visibility: Math.round(8 + Math.random() * 7),
  dewPoint: Math.round(22 + Math.random() * 6),
  sunrise: '06:15 AM',
  sunset: '06:45 PM',
  forecast: Array.from({ length: 7 }, (_, i) => ({
    day: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en', { weekday: 'short' }),
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    temp: Math.round(28 + Math.random() * 8),
    tempMin: Math.round(24 + Math.random() * 4),
    tempMax: Math.round(32 + Math.random() * 6),
    condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
    rain: Math.round(Math.random() * 80) + '%',
    humidity: Math.round(60 + Math.random() * 25),
    wind: Math.round(8 + Math.random() * 12)
  })),
  hourlyForecast: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    temp: Math.round(26 + Math.random() * 8),
    condition: ['Sunny', 'Cloudy', 'Rain'][Math.floor(Math.random() * 3)],
    rain: Math.round(Math.random() * 60)
  }))
});

const generateIoTData = () => Array.from({ length: 20 }, (_, i) => ({
  time: `${(i + 4).toString().padStart(2, '0')}:00`,
  timestamp: new Date(Date.now() - (19 - i) * 60 * 60 * 1000),
  soilMoisture: Math.round(45 + Math.random() * 30),
  soilTemp: Math.round(24 + Math.random() * 8),
  airTemp: Math.round(28 + Math.random() * 8),
  humidity: Math.round(60 + Math.random() * 25),
  pH: Number((6.2 + Math.random() * 1.6).toFixed(1)),
  light: Math.round(300 + Math.random() * 700),
  nitrogen: Math.round(15 + Math.random() * 20),
  phosphorus: Math.round(8 + Math.random() * 15),
  potassium: Math.round(20 + Math.random() * 25)
}));

const generateCropData = () => [
  {
    id: 1, name: 'Paddy Rice', variety: 'IR64', stage: 'Tillering',
    healthScore: 92, plantedDate: '2024-08-15', expectedHarvest: '2024-12-10',
    area: 5.2, yield: '4.5 tons/hectare',
    issues: ['Low nitrogen levels in sector B'],
    lastWatered: '2024-09-17', nextAction: 'Fertilizer application',
    soilMoisture: 78, pH: 6.8, nutrients: { N: 18, P: 12, K: 24 },
    growthRate: 85, pestActivity: 'Low', diseaseRisk: 'Medium',
    irrigation: 'Automated', lastFertilized: '2024-09-10'
  },
  {
    id: 2, name: 'Cotton', variety: 'BT Cotton', stage: 'Flowering',
    healthScore: 87, plantedDate: '2024-07-20', expectedHarvest: '2024-11-25',
    area: 3.8, yield: '2.8 tons/hectare',
    issues: ['Pink bollworm detected in sector A', 'Leaf curl virus symptoms'],
    lastWatered: '2024-09-16', nextAction: 'Pest control spray',
    soilMoisture: 65, pH: 7.2, nutrients: { N: 22, P: 15, K: 28 },
    growthRate: 78, pestActivity: 'High', diseaseRisk: 'High',
    irrigation: 'Drip system', lastFertilized: '2024-09-05'
  },
  {
    id: 3, name: 'Sugarcane', variety: 'Co 86032', stage: 'Grand Growth',
    healthScore: 95, plantedDate: '2024-02-10', expectedHarvest: '2025-01-15',
    area: 8.5, yield: '85 tons/hectare', issues: [],
    lastWatered: '2024-09-18', nextAction: 'Regular monitoring',
    soilMoisture: 82, pH: 6.5, nutrients: { N: 25, P: 18, K: 32 },
    growthRate: 92, pestActivity: 'Low', diseaseRisk: 'Low',
    irrigation: 'Flood irrigation', lastFertilized: '2024-09-12'
  },
  {
    id: 4, name: 'Groundnut', variety: 'TMV 7', stage: 'Pod Development',
    healthScore: 78, plantedDate: '2024-08-01', expectedHarvest: '2024-11-30',
    area: 2.1, yield: '2.2 tons/hectare',
    issues: ['Leaf spot disease in sector C', 'Iron deficiency'],
    lastWatered: '2024-09-15', nextAction: 'Fungicide treatment',
    soilMoisture: 58, pH: 6.9, nutrients: { N: 16, P: 20, K: 22 },
    growthRate: 72, pestActivity: 'Medium', diseaseRisk: 'High',
    irrigation: 'Sprinkler', lastFertilized: '2024-09-08'
  },
  {
    id: 5, name: 'Tomato', variety: 'Hybrid F1', stage: 'Fruiting',
    healthScore: 89, plantedDate: '2024-07-15', expectedHarvest: '2024-10-30',
    area: 1.5, yield: '45 tons/hectare',
    issues: ['Early blight symptoms'],
    lastWatered: '2024-09-18', nextAction: 'Harvest preparation',
    soilMoisture: 72, pH: 6.3, nutrients: { N: 28, P: 24, K: 35 },
    growthRate: 88, pestActivity: 'Medium', diseaseRisk: 'Medium',
    irrigation: 'Drip system', lastFertilized: '2024-09-14'
  },
  {
    id: 6, name: 'Maize', variety: 'Pioneer 3394', stage: 'Silking',
    healthScore: 91, plantedDate: '2024-06-20', expectedHarvest: '2024-10-15',
    area: 4.2, yield: '9.8 tons/hectare', issues: [],
    lastWatered: '2024-09-17', nextAction: 'Pest monitoring',
    soilMoisture: 75, pH: 6.7, nutrients: { N: 30, P: 16, K: 26 },
    growthRate: 89, pestActivity: 'Low', diseaseRisk: 'Low',
    irrigation: 'Center pivot', lastFertilized: '2024-09-11'
  }
];

const generateRiskAssessment = () => ({
  overallRisk: 'Medium',
  riskScore: 65,
  factors: [
    {
      type: 'Weather Conditions',
      risk: 'Low',
      score: 25,
      description: 'Favorable weather conditions expected for next 7 days',
      color: 'emerald',
      recommendations: ['Continue regular irrigation', 'Monitor for sudden weather changes'],
      impact: 'Low',
      probability: 'Low'
    },
    {
      type: 'Pest & Disease',
      risk: 'High',
      score: 85,
      description: 'Pink bollworm detected in cotton fields, leaf spot in groundnut',
      color: 'red',
      recommendations: ['Apply targeted pesticide spray', 'Increase monitoring frequency', 'Consider resistant varieties for next season'],
      impact: 'High',
      probability: 'High'
    },
    {
      type: 'Market Prices',
      risk: 'Medium',
      score: 55,
      description: 'Cotton prices showing volatility, paddy prices stable',
      color: 'yellow',
      recommendations: ['Monitor market trends daily', 'Consider forward contracts for cotton'],
      impact: 'Medium',
      probability: 'Medium'
    },
    {
      type: 'Water Availability',
      risk: 'High',
      score: 78,
      description: 'Reservoir levels 15% below normal, groundwater stress detected',
      color: 'red',
      recommendations: ['Implement water-saving techniques', 'Priority irrigation for high-value crops', 'Install moisture sensors'],
      impact: 'High',
      probability: 'Medium'
    },
    {
      type: 'Soil Health',
      risk: 'Low',
      score: 30,
      description: 'Soil nutrient levels within optimal range for most crops',
      color: 'emerald',
      recommendations: ['Continue current fertilization schedule', 'Regular soil testing'],
      impact: 'Low',
      probability: 'Low'
    },
    {
      type: 'Equipment Status',
      risk: 'Medium',
      score: 45,
      description: 'Irrigation pump #2 showing performance issues',
      color: 'yellow',
      recommendations: ['Schedule pump maintenance', 'Keep backup equipment ready'],
      impact: 'Medium',
      probability: 'Medium'
    }
  ],
  trends: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    risk: Math.round(40 + Math.random() * 40),
    weather: Math.round(20 + Math.random() * 30),
    pest: Math.round(30 + Math.random() * 50),
    market: Math.round(35 + Math.random() * 30),
    water: Math.round(50 + Math.random() * 35)
  }))
});

const generateAIRecommendations = () => [
  {
    id: 1,
    type: 'irrigation',
    priority: 'high',
    title: 'Optimize Irrigation Schedule',
    description: 'Based on weather forecast and soil moisture data, reduce irrigation by 20% for the next 3 days.',
    impact: 'Water savings: 15,000L, Cost reduction: ₹2,500',
    confidence: 95,
    expectedBenefit: 'High',
    implementation: 'Immediate',
    category: 'Resource Management'
  },
  {
    id: 2,
    type: 'disease',
    priority: 'critical',
    title: 'Disease Prevention Action Required',
    description: 'Early blight symptoms detected in tomato crop. Apply copper-based fungicide within 48 hours.',
    impact: 'Prevent 30-40% yield loss, Save ₹45,000 potential damage',
    confidence: 88,
    expectedBenefit: 'Very High',
    implementation: 'Within 48 hours',
    category: 'Crop Protection'
  },
  {
    id: 3,
    type: 'fertilizer',
    priority: 'medium',
    title: 'Nutrient Management Adjustment',
    description: 'Soil analysis shows nitrogen deficiency in paddy fields. Apply urea fertilizer at 50kg/hectare.',
    impact: 'Increase yield by 15-20%, Additional revenue: ₹18,000',
    confidence: 92,
    expectedBenefit: 'High',
    implementation: 'Within 1 week',
    category: 'Nutrition Management'
  },
  {
    id: 4,
    type: 'pest',
    priority: 'high',
    title: 'Integrated Pest Management',
    description: 'Pink bollworm activity increasing. Deploy pheromone traps and schedule biocontrol release.',
    impact: 'Reduce chemical pesticide use by 40%, Cost savings: ₹8,000',
    confidence: 85,
    expectedBenefit: 'High',
    implementation: 'Within 3 days',
    category: 'Pest Control'
  },
  {
    id: 5,
    type: 'harvest',
    priority: 'medium',
    title: 'Harvest Timing Optimization',
    description: 'Tomato crop will reach optimal maturity in 12-14 days. Prepare harvesting equipment and labor.',
    impact: 'Maximize quality and market value, Premium pricing opportunity',
    confidence: 90,
    expectedBenefit: 'Medium',
    implementation: 'Next 2 weeks',
    category: 'Harvest Planning'
  }
];

const generateHistoryData = () => Array.from({ length: 50 }, (_, i) => {
  const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
  const actions = ['Irrigation', 'Fertilizer Application', 'Pest Control', 'Soil Testing', 'Harvesting', 'Planting', 'Pruning'];
  const crops = ['Paddy Rice', 'Cotton', 'Sugarcane', 'Groundnut', 'Tomato', 'Maize'];
  const status = ['Completed', 'In Progress', 'Scheduled', 'Cancelled'];

  return {
    id: i + 1,
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
    action: actions[Math.floor(Math.random() * actions.length)],
    crop: crops[Math.floor(Math.random() * crops.length)],
    status: status[Math.floor(Math.random() * status.length)],
    details: `Applied to ${Math.round(1 + Math.random() * 5)} acres`,
    cost: Math.round(500 + Math.random() * 5000),
    user: ['John Farmer', 'Mary Agronomist', 'System Auto'][Math.floor(Math.random() * 3)],
    notes: ['Weather conditions optimal', 'Soil moisture adequate', 'No issues reported', 'Equipment working normally'][Math.floor(Math.random() * 4)]
  };
});

const generateTeamData = () => [
  { id: 1, name: 'John Doe', role: 'Farmer', email: 'john.d@farm.com' },
  { id: 2, name: 'Mary Agronomist', role: 'Agronomist', email: 'mary.a@agri.org' },
  { id: 3, name: 'System Auto', role: 'Admin', email: 'system@agritech.com' }
];

// --- Helper Functions & Components ---
const getHealthColor = (score) => {
  if (score > 90) return '#10b981';
  if (score > 75) return '#eab308';
  return '#ef4444';
};

const getRiskColor = (risk) => {
  if (risk === 'Low') return '#10b981';
  if (risk === 'Medium') return '#eab308';
  return '#ef4444';
};

const getRiskBg = (risk, darkMode) => {
  if (risk === 'Low') return darkMode ? '#042f2e' : '#ecfdf5';
  if (risk === 'Medium') return darkMode ? '#422006' : '#fffbe5';
  return darkMode ? '#450a0a' : '#fee2e2';
};

const getPriorityColor = (priority) => {
  if (priority === 'critical') return '#ef4444';
  if (priority === 'high') return '#eab308';
  return '#10b981';
};

const getPriorityBg = (priority) => {
  if (priority === 'critical') return '#ef4444';
  if (priority === 'high') return '#eab308';
  return '#10b981';
};

const getStatusColor = (status) => {
  if (status === 'Completed') return '#10b981';
  if (status === 'In Progress') return '#eab308';
  if (status === 'Cancelled') return '#ef4444';
  return '#6b7280';
};

const StatCard = ({ title, value, icon, unit, color, hasShadow = true }) => {
  const Icon = icon;
  return (
    <div style={{
      padding: '20px',
      borderRadius: '12px',
      boxShadow: hasShadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
      border: `1px solid ${color.border}`,
      backgroundColor: color.bg,
      color: color.text,
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: hasShadow ? '0 10px 20px rgba(0, 0, 0, 0.15)' : 'none',
      }
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#9ca3af' }}>{title}</span>
          <span style={{ fontSize: '30px', fontWeight: 'bold', marginTop: '4px' }}>
            {value} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>{unit}</span>
          </span>
        </div>
        <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: color.iconBg }}>
          <Icon size={24} style={{ color: color.icon }} />
        </div>
      </div>
    </div>
  );
};

const Card = ({ children, title, style, actions = null, darkMode }) => {
  const cardStyle = {
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`,
    backgroundColor: darkMode ? '#1e293b' : '#fff',
    transition: 'background-color 0.3s, border-color 0.3s',
    ...style
  };
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontWeight: '600', fontSize: '18px' }}>{title}</h3>
        {actions}
      </div>
      {children}
    </div>
  );
};

const SectionTitle = ({ title, subtitle, darkMode }) => (
  <div style={{ marginBottom: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: darkMode ? '#fff' : '#1f2937' }}>{title}</h2>
    <p style={{ fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>{subtitle}</p>
  </div>
);

const Modal = ({ title, onClose, children, darkMode }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
    <div style={{ backgroundColor: darkMode ? '#1e293b' : '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)', width: '90%', maxWidth: '500px', position: 'relative' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer', color: darkMode ? '#9ca3af' : '#6b7280' }}>
        <X size={24} />
      </button>
      <h3 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '16px', color: darkMode ? '#fff' : '#1f2937' }}>{title}</h3>
      {children}
    </div>
  </div>
);

// --- Dashboard Tab Components ---
const MainDashboard = ({ weather, crops, riskAssessment, iotData, darkMode }) => {
  const avgHealth = (crops.reduce((sum, crop) => sum + crop.healthScore, 0) / crops.length).toFixed(1);
  const highRiskIssues = riskAssessment.factors.filter(f => f.risk === 'High').length;

  const latestIotData = useMemo(() => {
    return iotData[iotData.length - 1] || {};
  }, [iotData]);

  const riskPieData = useMemo(() => {
    const riskCounts = riskAssessment.factors.reduce((acc, factor) => {
      acc[factor.risk] = (acc[factor.risk] || 0) + 1;
      return acc;
    }, {});
    const colors = { 'Low': '#10b981', 'Medium': '#eab308', 'High': '#ef4444' };
    return Object.entries(riskCounts).map(([risk, value]) => ({
      name: risk,
      value: value,
      color: colors[risk] || '#6b7280'
    }));
  }, [riskAssessment]);

  const nutrientData = useMemo(() => ([
    { name: 'Nitrogen', value: latestIotData.nitrogen || 0, fullMark: 35 },
    { name: 'Phosphorus', value: latestIotData.phosphorus || 0, fullMark: 25 },
    { name: 'Potassium', value: latestIotData.potassium || 0, fullMark: 35 },
    { name: 'pH', value: latestIotData.pH || 0, fullMark: 9 },
    { name: 'Light', value: latestIotData.light || 0, fullMark: 1000 },
    { name: 'Soil Moisture', value: latestIotData.soilMoisture || 0, fullMark: 100 },
  ]), [latestIotData]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '24px', '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' }, '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(4, 1fr)' } }}>
      <StatCard
        title="Current Temp"
        value={weather.temperature}
        unit="°C"
        icon={Thermometer}
        color={{ bg: '#eef2ff', border: '#c7d2fe', text: '#4f46e5', iconBg: '#4f46e5', icon: '#fff' }}
      />
      <StatCard
        title="Avg Crop Health"
        value={avgHealth}
        unit="%"
        icon={Sprout}
        color={{ bg: '#ecfdf5', border: '#a7f3d0', text: '#10b981', iconBg: '#10b981', icon: '#fff' }}
      />
      <StatCard
        title="Soil Moisture"
        value={latestIotData.soilMoisture}
        unit="%"
        icon={Droplets}
        color={{ bg: '#eff6ff', border: '#bfdbfe', text: '#3b82f6', iconBg: '#3b82f6', icon: '#fff' }}
      />
      <StatCard
        title="High Risks"
        value={highRiskIssues}
        unit="Issues"
        icon={Shield}
        color={{ bg: '#fff1f2', border: '#fecaca', text: '#ef4444', iconBg: '#ef4444', icon: '#fff' }}
      />

      <div style={{ gridColumn: 'span 2' }}>
        <Card title="Soil & Air Metrics (Last 24h)" darkMode={darkMode} style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={iotData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e5e7eb'} />
              <XAxis dataKey="time" stroke={darkMode ? '#94a3b8' : '#6b7280'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#6b7280'} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', border: 'none' }} />
              <Area type="monotone" dataKey="soilMoisture" name="Soil Moisture (%)" stroke="#3b82f6" fillOpacity={1} fill="#3b82f6" />
              <Area type="monotone" dataKey="airTemp" name="Air Temp (°C)" stroke="#ef4444" fillOpacity={1} fill="#ef4444" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '24px', '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(2, 1fr)' } }}>
        <Card title="Soil Nutrient Profile" darkMode={darkMode} style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={nutrientData}>
              <PolarGrid stroke={darkMode ? '#475569' : '#e5e7eb'} />
              <PolarAngleAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#6b7280'} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={darkMode ? '#94a3b8' : '#6b7280'} />
              <Radar name="Current Levels" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', border: 'none' }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Risk Factor Distribution" darkMode={darkMode} style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {riskPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', border: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

const WeatherDashboard = ({ weather, darkMode }) => {
  const getIcon = (condition) => {
    if (condition.includes('Sunny')) return Sun;
    if (condition.includes('Cloudy')) return Cloud;
    if (condition.includes('Rain')) return CloudRain;
    return Sun;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionTitle title="Farm Weather Forecast" subtitle={`Current weather for ${weather.location}`} darkMode={darkMode} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '24px', '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' } }}>
        <Card title="Current Conditions" darkMode={darkMode}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '64px', color: '#3b82f6' }}>
              {React.createElement(getIcon(weather.condition), { size: 64 })}
            </div>
            <div>
              <p style={{ fontSize: '48px', fontWeight: 'bold' }}>{weather.temperature}°C</p>
              <p style={{ fontSize: '20px', color: '#9ca3af' }}>{weather.condition}</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplets size={20} style={{ color: '#60a5fa' }} />
              <p style={{ fontSize: '14px' }}>Humidity: {weather.humidity}%</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wind size={20} style={{ color: '#9ca3af' }} />
              <p style={{ fontSize: '14px' }}>Wind: {weather.wind} km/h</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sun size={20} style={{ color: '#f59e0b' }} />
              <p style={{ fontSize: '14px' }}>UV Index: {weather.uvIndex}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CloudRain size={20} style={{ color: '#8b5cf6' }} />
              <p style={{ fontSize: '14px' }}>Rainfall: {weather.rainfall} mm</p>
            </div>
          </div>
        </Card>
        <Card title="Hourly Forecast" darkMode={darkMode} style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weather.hourlyForecast} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e5e7eb'} />
              <XAxis dataKey="hour" stroke={darkMode ? '#94a3b8' : '#6b7280'} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke={darkMode ? '#94a3b8' : '#6b7280'} />
              <Tooltip />
              <Area type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#6366f1" fillOpacity={1} fill="#6366f1" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card title="7-Day Forecast" darkMode={darkMode}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', textAlign: 'center', '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(4, 1fr)' }, '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(7, 1fr)' } }}>
          {weather.forecast.map((day, index) => (
            <div key={index} style={{ padding: '16px', borderRadius: '12px', transition: 'background-color 0.3s', cursor: 'pointer', backgroundColor: darkMode ? '#1e293b' : '#fff' }}>
              <p style={{ fontWeight: '600', fontSize: '14px' }}>{day.day}</p>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{day.date}</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                {React.createElement(getIcon(day.condition), { size: 32, style: { color: '#3b82f6' } })}
              </div>
              <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{day.temp}°C</p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>Rain: {day.rain}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const CropsDashboard = ({ crops, setCrops, darkMode }) => {
  const healthData = crops.map(crop => ({ name: crop.name, healthScore: crop.healthScore }));
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: '', variety: '', stage: '', area: '', expectedHarvest: ''
  });

  const handleAddCrop = () => {
    if (newCrop.name && newCrop.variety) {
      const id = crops.length + 1;
      const newCropData = {
        id,
        ...newCrop,
        healthScore: 100,
        issues: [],
        soilMoisture: 75,
        pH: 6.8,
        nutrients: { N: 20, P: 15, K: 25 },
        growthRate: 90,
        pestActivity: 'Low',
        diseaseRisk: 'Low',
        lastWatered: new Date().toLocaleDateString(),
        lastFertilized: new Date().toLocaleDateString(),
      };
      setCrops(prev => [...prev, newCropData]);
      setShowAddCropModal(false);
      setNewCrop({ name: '', variety: '', stage: '', area: '', expectedHarvest: '' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionTitle title="Crop Health & Status" subtitle="Overview of all crops and their current growth status" darkMode={darkMode} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '24px', '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' } }}>
        <Card title="Overall Crop Health" darkMode={darkMode} style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={healthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#6b7280'} />
              <YAxis domain={[0, 100]} stroke={darkMode ? '#94a3b8' : '#6b7280'} />
              <Tooltip />
              <Bar dataKey="healthScore" name="Health Score (%)">
                {healthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getHealthColor(entry.healthScore)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="All Crops" darkMode={darkMode} actions={<button onClick={() => setShowAddCropModal(true)} style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}><Plus size={16} /></button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {crops.map(crop => (
              <div key={crop.id} style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`, transition: 'background-color 0.3s', cursor: 'pointer', ':hover': { backgroundColor: darkMode ? '#334155' : '#f3f4f6' } }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sprout size={20} style={{ color: getHealthColor(crop.healthScore) }} />
                  <span style={{ fontWeight: '600' }}>{crop.name}</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: getHealthColor(crop.healthScore), marginLeft: 'auto' }}>{crop.healthScore}%</span>
                </div>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', color: '#6b7280' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} /><span>Area: {crop.area} acres</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Gauge size={16} /><span>Stage: {crop.stage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {showAddCropModal && (
        <Modal title="Add New Crop" onClose={() => setShowAddCropModal(false)} darkMode={darkMode}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" placeholder="Crop Name" value={newCrop.name} onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`, backgroundColor: darkMode ? '#334155' : '#fff', color: darkMode ? '#fff' : '#1f2937' }} />
            <input type="text" placeholder="Variety" value={newCrop.variety} onChange={(e) => setNewCrop({ ...newCrop, variety: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`, backgroundColor: darkMode ? '#334155' : '#fff', color: darkMode ? '#fff' : '#1f2937' }} />
            <input type="text" placeholder="Stage" value={newCrop.stage} onChange={(e) => setNewCrop({ ...newCrop, stage: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`, backgroundColor: darkMode ? '#334155' : '#fff', color: darkMode ? '#fff' : '#1f2937' }} />
            <input type="text" placeholder="Area (acres)" value={newCrop.area} onChange={(e) => setNewCrop({ ...newCrop, area: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`, backgroundColor: darkMode ? '#334155' : '#fff', color: darkMode ? '#fff' : '#1f2937' }} />
            <input type="date" placeholder="Expected Harvest" value={newCrop.expectedHarvest} onChange={(e) => setNewCrop({ ...newCrop, expectedHarvest: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`, backgroundColor: darkMode ? '#334155' : '#fff', color: darkMode ? '#fff' : '#1f2937' }} />
            <button onClick={handleAddCrop} style={{ padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', backgroundColor: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background-color 0.3s', ':hover': { backgroundColor: '#059669' } }}>Add Crop</button>
          </div>
        </Modal>
      )}
    </div>
  );
};


const RiskDashboard = ({ riskAssessment, darkMode }) => {
  const trendData = useMemo(() => {
    return riskAssessment.trends.map(item => ({
      date: item.date,
      Overall: item.risk,
      Weather: item.weather,
      Pest: item.pest,
      Water: item.water
    }));
  }, [riskAssessment]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionTitle
        title="Risk & Threat Assessment"
        subtitle={`Overall Farm Risk: ${riskAssessment.overallRisk} (Score: ${riskAssessment.riskScore}/100)`}
        darkMode={darkMode}
      />
      <Card title="Key Risk Factors" darkMode={darkMode}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px', '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' }, '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
          {riskAssessment.factors.map(factor => (
            <div key={factor.type} style={{ padding: '16px', borderRadius: '12px', backgroundColor: getRiskBg(factor.risk, darkMode), transition: 'transform 0.3s', cursor: 'pointer', ':hover': { transform: 'translateY(-5px)' } }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: getRiskColor(factor.risk) }}>{factor.type}</span>
                <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '9999px', fontWeight: 'bold', backgroundColor: getRiskBg(factor.risk, darkMode), color: getRiskColor(factor.risk) }}>
                  {factor.risk}
                </span>
              </div>
              <p style={{ fontSize: '14px', color: darkMode ? '#d1d5db' : '#374151' }}>{factor.description}</p>
              <ul style={{ marginTop: '8px', fontSize: '12px', listStyleType: 'disc', paddingLeft: '20px' }}>
                {factor.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Risk Trends Over Last 30 Days" darkMode={darkMode}>
        <div style={{ height: '384px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e5e7eb'} />
              <XAxis dataKey="date" stroke={darkMode ? '#94a3b8' : '#6b7280'} />
              <YAxis domain={[0, 100]} stroke={darkMode ? '#94a3b8' : '#6b7280'} />
              <Tooltip />
              <div className="recharts-legend-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
                <ul className="recharts-legend-item-list" style={{ display: 'flex', gap: '16px', listStyleType: 'none', padding: 0 }}>
                  <li style={{ color: '#8884d8' }}>Overall</li>
                  <li style={{ color: '#82ca9d' }}>Weather</li>
                  <li style={{ color: '#ffc658' }}>Pest</li>
                  <li style={{ color: '#ff7300' }}>Water</li>
                </ul>
              </div>
              <Line type="monotone" dataKey="Overall" stroke="#8884d8" name="Overall Risk" />
              <Line type="monotone" dataKey="Weather" stroke="#82ca9d" name="Weather Risk" />
              <Line type="monotone" dataKey="Pest" stroke="#ffc658" name="Pest Risk" />
              <Line type="monotone" dataKey="Water" stroke="#ff7300" name="Water Risk" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

const AIDashboard = ({ aiRecommendations, chatMessages, chatInput, setChatInput, sendChatMessage, darkMode }) => {
  const getChatBg = (type) => (type === 'user' ? '#4f46e5' : darkMode ? '#334155' : '#e5e7eb');
  const getChatText = (type) => (type === 'user' ? '#fff' : darkMode ? '#d1d5db' : '#1f2937');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionTitle
        title="AI Assistant & Recommendations"
        subtitle="Intelligent insights and automated actions for your farm"
        darkMode={darkMode}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '24px', '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' } }}>
        <Card title="AI Recommendations" darkMode={darkMode}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {aiRecommendations.map(rec => (
              <div key={rec.id} style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`, cursor: 'pointer', transition: 'transform 0.3s', ':hover': { transform: 'translateY(-5px)' } }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getPriorityBg(rec.priority) }} />
                  <span style={{ fontWeight: '600', color: getPriorityColor(rec.priority), textTransform: 'capitalize' }}>{rec.priority} Priority</span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Confidence: {rec.confidence}%</span>
                </div>
                <h4 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '4px' }}>{rec.title}</h4>
                <p style={{ fontSize: '14px', color: darkMode ? '#d1d5db' : '#374151' }}>{rec.description}</p>
                <p style={{ marginTop: '8px', fontSize: '12px', fontStyle: 'italic', color: '#6b7280' }}>Expected Benefit: {rec.expectedBenefit}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="AI Chat Assistant" darkMode={darkMode} style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
          <div style={{ flex: '1', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {chatMessages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ padding: '16px', borderRadius: '12px', maxWidth: '320px', backgroundColor: getChatBg(msg.type), color: getChatText(msg.type) }}>
                  <p>{msg.message}</p>
                  <span style={{ display: 'block', fontSize: '12px', marginTop: '4px', opacity: '0.7' }}>
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '16px', borderTop: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                style={{ flex: '1', padding: '12px', borderRadius: '12px', border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`, backgroundColor: darkMode ? '#334155' : '#f3f4f6', color: darkMode ? '#fff' : '#1f2937' }}
                placeholder="Ask me anything about your farm..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              />
              <button
                onClick={sendChatMessage}
                style={{ padding: '12px', borderRadius: '50%', backgroundColor: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background-color 0.3s' }}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const EmergencyDashboard = ({ sendSOS, darkMode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <SectionTitle
      title="Emergency Response System"
      subtitle="Quick access to emergency protocols and contact information"
      darkMode={darkMode}
    />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '24px', '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' } }}>
      <Card title="Emergency SOS" darkMode={darkMode}>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>In a critical situation, press the button below to send an immediate alert to farm managers and emergency services with your current location.</p>
        <button
          onClick={sendSOS}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', color: '#fff', fontWeight: 'bold', fontSize: '18px', transition: 'background-color 0.3s', backgroundColor: '#dc2626', border: 'none', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <AlertTriangle size={24} />
            SEND EMERGENCY SOS
          </div>
        </button>
      </Card>
      <Card title="Emergency Contacts" darkMode={darkMode}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Phone size={20} style={{ color: '#6b7280' }} />
            <div>
              <p style={{ fontWeight: '600' }}>Farm Manager: Jane Doe</p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>+91 98765 43210</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Mail size={20} style={{ color: '#6b7280' }} />
            <div>
              <p style={{ fontWeight: '600' }}>Local Agronomist: Dr. Smith</p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>dr.smith@agri.org</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const HistoryDashboard = ({ historyData, darkMode }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionTitle
        title="Farm Activity History"
        subtitle="Review and track all past actions and events on your farm"
        darkMode={darkMode}
      />
      <Card title="Activity Log" darkMode={darkMode}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', textTransform: 'uppercase', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em', color: '#6b7280', borderBottom: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}` }}>
                <th style={{ padding: '8px 16px' }}>Date</th>
                <th style={{ padding: '8px 16px' }}>Action</th>
                <th style={{ padding: '8px 16px' }}>Crop</th>
                <th style={{ padding: '8px 16px' }}>Status</th>
                <th style={{ padding: '8px 16px' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {historyData.slice(0, 15).map(item => (
                <tr key={item.id} style={{ transition: 'background-color 0.2s', fontSize: '14px', borderBottom: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`, cursor: 'pointer', ':hover': { backgroundColor: darkMode ? '#2d3748' : '#f7f7f7' } }}>
                  <td style={{ padding: '16px' }}>{item.date}</td>
                  <td style={{ padding: '16px' }}>{item.action}</td>
                  <td style={{ padding: '16px' }}>{item.crop}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ fontWeight: '600', color: getStatusColor(item.status) }}>{item.status}</span>
                  </td>
                  <td style={{ padding: '16px' }}>{item.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const ReportsDashboard = ({ darkMode, exportData }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <SectionTitle
      title="Reports & Analytics"
      subtitle="Generate detailed reports and download farm data"
      darkMode={darkMode}
    />
    <Card title="Report Generation" darkMode={darkMode} actions={<button onClick={exportData} style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', backgroundColor: darkMode ? '#4f46e5' : '#eef2ff', color: darkMode ? '#fff' : '#4f46e5', border: 'none', cursor: 'pointer' }}>Export Data</button>}>
      <p style={{ fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>Create custom reports on crop performance, financial metrics, and resource usage. </p>
    </Card>
    <Card title="Yield & Production Report" darkMode={darkMode}>
      <p style={{ fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>Analysis of expected yield vs. historical data.</p>
    </Card>
  </div>
);

const MapDashboard = ({ darkMode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <SectionTitle
      title="Farm Map & GIS"
      subtitle="View your farm layout, sensor locations, and crop distribution"
      darkMode={darkMode}
    />
    <Card title="Interactive Farm Map" darkMode={darkMode}>
      <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #d1d5db', borderRadius: '8px', padding: '24px' }}>
        <p style={{ color: '#6b7280', textAlign: 'center' }}>Map Integration Placeholder: A map with sensor markers and crop sectors would be displayed here.</p>
      </div>
    </Card>
  </div>
);

const TeamDashboard = ({ team, setTeam, darkMode }) => {
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: 'Farmer', email: '' });

  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      const id = team.length + 1;
      setTeam(prev => [...prev, { id, ...newMember }]);
      setShowAddTeamMemberModal(false);
      setNewMember({ name: '', role: 'Farmer', email: '' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionTitle
        title="Team & User Management"
        subtitle="Manage farm users, roles, and access permissions"
        darkMode={darkMode}
      />
      <Card title="Team Members" darkMode={darkMode} actions={<button onClick={() => setShowAddTeamMemberModal(true)} style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}><Plus size={16} /></button>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {team.map(member => (
            <div key={member.id} style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`, transition: 'background-color 0.3s', cursor: 'pointer', ':hover': { backgroundColor: darkMode ? '#334155' : '#f3f4f6' } }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: member.role === 'Admin' ? '#ef4444' : member.role === 'Agronomist' ? '#10b981' : '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p style={{ fontWeight: '600' }}>{member.name}</p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {showAddTeamMemberModal && (
        <Modal title="Add New Team Member" onClose={() => setShowAddTeamMemberModal(false)} darkMode={darkMode}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" placeholder="Full Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`, backgroundColor: darkMode ? '#334155' : '#fff', color: darkMode ? '#fff' : '#1f2937' }} />
            <input type="email" placeholder="Email Address" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`, backgroundColor: darkMode ? '#334155' : '#fff', color: darkMode ? '#fff' : '#1f2937' }} />
            <select value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`, backgroundColor: darkMode ? '#334155' : '#fff', color: darkMode ? '#fff' : '#1f2937' }}>
              <option value="Farmer">Farmer</option>
              <option value="Agronomist">Agronomist</option>
              <option value="Admin">Admin</option>
            </select>
            <button onClick={handleAddMember} style={{ padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', backgroundColor: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background-color 0.3s', ':hover': { backgroundColor: '#059669' } }}>Add Member</button>
          </div>
        </Modal>
      )}
    </div>
  );
};


// Header Component
const Header = ({ activeTab, darkMode, exportData, setSidebarOpen, sidebarOpen, userProfile }) => {
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: '8px', borderRadius: '8px', backgroundColor: darkMode ? '#1e293b' : '#fff', border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`, cursor: 'pointer', display: 'none' }}>
          <Menu size={20} style={{ color: darkMode ? '#9ca3af' : '#6b7280' }} />
        </button>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', textTransform: 'capitalize' }}>{activeTab}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={exportData} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', transition: 'background-color 0.3s', backgroundColor: darkMode ? '#334155' : '#f3f4f6', color: darkMode ? '#d1d5db' : '#374151', border: 'none', cursor: 'pointer' }}>
          <Download size={16} />
          <span style={{ fontSize: '14px', fontWeight: '600' }}>Export Data</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>{userProfile.name}</span>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{getInitials(userProfile.name)}</div>
        </div>
      </div>
    </header>
  );
};

// User Settings Component
const UserSettings = ({ userProfile, setUserProfile, darkMode }) => {
  const [name, setName] = useState(userProfile.name);
  const [role, setRole] = useState(userProfile.role);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setUserProfile({ ...userProfile, name, role });
    setIsEditing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionTitle title="User Settings" subtitle="Update your profile and account information" darkMode={darkMode} />
      <Card title="Profile Information" darkMode={darkMode} actions={
        !isEditing ? (
          <button onClick={() => setIsEditing(true)} style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}>
            <Edit size={16} />
          </button>
        ) : (
          <button onClick={handleSave} style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', backgroundColor: '#10b981', color: '#fff', border: 'none', cursor: 'pointer' }}>
            <Save size={16} />
          </button>
        )
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`, backgroundColor: isEditing ? (darkMode ? '#334155' : '#fff') : (darkMode ? '#1e293b' : '#f3f4f6'), color: darkMode ? '#fff' : '#1f2937', width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={!isEditing}
              style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`, backgroundColor: isEditing ? (darkMode ? '#334155' : '#fff') : (darkMode ? '#1e293b' : '#f3f4f6'), color: darkMode ? '#fff' : '#1f2937', width: '100%' }}
            >
              <option value="Farmer">Farmer</option>
              <option value="Agronomist">Agronomist</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
};


// Main Dashboard Component
const AgriTechDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSOSModal, setShowSOSModal] = useState(false);

  // Data States
  const [weather, setWeather] = useState(generateRealisticWeatherData());
  const [crops, setCrops] = useState(generateCropData());
  const [riskAssessment] = useState(generateRiskAssessment());
  const [iotData, setIotData] = useState(generateIoTData());
  const [aiRecommendations] = useState(generateAIRecommendations());
  const [historyData] = useState(generateHistoryData());
  const [team, setTeam] = useState(generateTeamData());
  const [userProfile, setUserProfile] = useState({ name: 'John Doe', role: 'Farmer', email: 'john.d@farm.com' });

  // AI Chat State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'ai', message: 'Hello! I\'m your AI agricultural assistant. How can I help you optimize your farm today?', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIotData(generateIoTData());
      setWeather(generateRealisticWeatherData());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Emergency SOS Function
  const sendSOS = () => {
    setShowSOSModal(true);
  };

  // Export Data Function
  const exportData = () => {
    const data = {
      weather,
      crops,
      riskAssessment,
      iotData: iotData.slice(-10), // Last 10 readings
      timestamp: new Date().toISOString(),
      farmId: 'FARM_001',
      exportedBy: userProfile.role
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farm-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // AI Chat Handler
  const sendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', message: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Based on your soil moisture data, I recommend reducing irrigation by 15% for the next 3 days.',
        'The weather forecast shows rain in 2 days. Consider adjusting your fertilizer application schedule.',
        'Your cotton crop shows signs of pest activity. I suggest implementing integrated pest management.',
        'Soil pH levels are optimal for your current crops. Continue with the existing nutrient program.',
        'Market prices for paddy are expected to rise next week. Consider timing your harvest accordingly.'
      ];
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setChatInput('');
  };

  const mainContainerStyle = {
    minHeight: '100vh',
    transition: 'background-color 0.3s, color 0.3s',
    backgroundColor: darkMode ? '#0f172a' : '#f9fafb',
    color: darkMode ? '#e2e8f0' : '#1f2937'
  };

  return (
    <div style={mainContainerStyle}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar
          active={activeTab}
          setActive={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          userProfile={userProfile}
          sendSos={sendSOS}
          isOnline={isOnline}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <main style={{ flex: '1', padding: '24px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {/* Header */}
            <Header
              activeTab={activeTab}
              darkMode={darkMode}
              userProfile={userProfile}
              exportData={exportData}
              setSidebarOpen={setSidebarOpen}
              sidebarOpen={sidebarOpen}
            />

            {/* Content Router */}
            <div style={{ marginTop: '24px' }}>
              {activeTab === 'dashboard' && <MainDashboard weather={weather} crops={crops} riskAssessment={riskAssessment} iotData={iotData} darkMode={darkMode} />}
              {activeTab === 'weather' && <WeatherDashboard weather={weather} darkMode={darkMode} />}
              {activeTab === 'crops' && <CropsDashboard crops={crops} setCrops={setCrops} darkMode={darkMode} />}
              {activeTab === 'risks' && <RiskDashboard riskAssessment={riskAssessment} darkMode={darkMode} />}
              {activeTab === 'ai' && <AIDashboard aiRecommendations={aiRecommendations} chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput} sendChatMessage={sendChatMessage} darkMode={darkMode} />}
              {activeTab === 'emergency' && <EmergencyDashboard sendSOS={sendSOS} darkMode={darkMode} />}
              {activeTab === 'history' && <HistoryDashboard historyData={historyData} darkMode={darkMode} />}
              {activeTab === 'reports' && <ReportsDashboard darkMode={darkMode} exportData={exportData} />}
              {activeTab === 'map' && <MapDashboard darkMode={darkMode} />}
              {activeTab === 'team' && <TeamDashboard team={team} setTeam={setTeam} darkMode={darkMode} />}
              {activeTab === 'settings' && <UserSettings userProfile={userProfile} setUserProfile={setUserProfile} darkMode={darkMode} />}
            </div>
          </div>
        </main>
      </div>
      {showSOSModal && (
        <Modal title="Emergency SOS" onClose={() => setShowSOSModal(false)} darkMode={darkMode}>
          <p>An emergency alert has been sent to your contacts and emergency services.</p>
          <p><strong>Location:</strong> Chennai, Tamil Nadu</p>
          <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
        </Modal>
      )}
    </div>
  );
};

// Enhanced Sidebar Component
const Sidebar = ({ active, setActive, darkMode, setDarkMode, userProfile, sendSos, isOnline, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'weather', label: 'Weather', icon: Sun, badge: null },
    { id: 'crops', label: 'Crop Status', icon: Sprout, badge: '6' },
    { id: 'risks', label: 'Risk Assessment', icon: Shield, badge: '3' },
    { id: 'ai', label: 'AI Assistant', icon: Zap, badge: 'NEW' },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle, badge: null },
    { id: 'history', label: 'History', icon: History, badge: null },
    { id: 'reports', label: 'Reports', icon: FileText, badge: null },
    { id: 'map', label: 'Farm Map', icon: Map, badge: null },
    { id: 'team', label: 'Team', icon: Users, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const sidebarStyle = {
    width: '320px',
    padding: '24px',
    transition: 'width 0.3s, background-color 0.3s, border-color 0.3s',
    borderRight: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`,
    backgroundColor: darkMode ? '#1e293b' : '#fff',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: darkMode ? '#e2e8f0' : '#1f2937'
  };

  const compactSidebarStyle = {
    width: '64px',
    padding: '16px',
    transition: 'width 0.3s, background-color 0.3s, border-color 0.3s',
    borderRight: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`,
    backgroundColor: darkMode ? '#1e293b' : '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const navButtonStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderRadius: '12px',
    transition: 'all 0.2s',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent'
  };

  const navButtonActiveStyle = {
    ...navButtonStyle,
    background: 'linear-gradient(to right, #4f46e5, #8b5cf6)',
    color: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transform: 'scale(1.02)'
  };

  if (!isOpen) {
    return (
      <aside style={compactSidebarStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(to bottom right, #10b981, #3b82f6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={24} style={{ color: '#fff' }} />
          </div>
          {menuItems.map(item => {
            const Icon = item.icon;
            const buttonStyle = {
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.3s, color 0.3s',
              backgroundColor: active === item.id ? 'linear-gradient(to right, #4f46e5, #8b5cf6)' : 'transparent',
              border: 'none',
              cursor: 'pointer'
            };
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                style={{
                  ...buttonStyle,
                  ...(active === item.id ? { background: 'linear-gradient(to right, #4f46e5, #8b5cf6)', color: '#fff' } : { color: darkMode ? '#9ca3af' : '#6b7280' }),
                  ':hover': { backgroundColor: darkMode ? '#334155' : '#f3f4f6' }
                }}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <button onClick={toggleDarkMode} style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Sun size={20} style={{ color: darkMode ? '#facc15' : '#eab308' }} />
          </button>
          <button onClick={() => setIsOpen(true)} style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Menu size={20} style={{ color: darkMode ? '#9ca3af' : '#6b7280' }} />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside style={sidebarStyle}>
      <div style={{ flex: '1' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(to bottom right, #10b981, #3b82f6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              <Leaf size={28} style={{ color: '#fff' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', background: 'linear-gradient(to right, #16a34a, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AgriTech Pro</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <Wifi size={12} style={{ color: isOnline ? '#22c55e' : '#ef4444' }} />
                <span style={{ color: isOnline ? '#22c55e' : '#ef4444' }}>{isOnline ? 'Connected' : 'Offline'}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        <nav style={{ marginBottom: '32px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = active === item.id;
              const finalButtonStyle = isActive ? navButtonActiveStyle : { ...navButtonStyle, ...(darkMode ? { color: '#d1d5db', ':hover': { backgroundColor: '#334155' } } : { color: '#374151', ':hover': { backgroundColor: '#f3f4f6' } }) };
              const iconColor = isActive ? '#fff' : darkMode ? '#9ca3af' : '#6b7280';
              const badgeBg = item.badge === 'NEW' ? '#22c55e' : isActive ? 'rgba(255,255,255,0.2)' : '#eef2ff';
              const badgeColor = item.badge === 'NEW' ? '#fff' : isActive ? '#fff' : '#4f46e5';

              return (
                <li key={item.id} style={{ marginBottom: '8px' }}>
                  <button onClick={() => setActive(item.id)} style={finalButtonStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icon size={20} style={{ color: iconColor }} />
                      <span style={{ fontWeight: '600' }}>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '9999px', backgroundColor: badgeBg, color: badgeColor }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', backgroundColor: darkMode ? '#334155' : 'linear-gradient(to right, #ecfdf5, #eff6ff)' }}>
          <h3 style={{ fontWeight: '600', fontSize: '14px', marginBottom: '12px' }}>Quick Stats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Total Area:</span>
              <span style={{ fontWeight: '600' }}>21.3 acres</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Active Crops:</span>
              <span style={{ fontWeight: '600' }}>6 varieties</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Avg Health:</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>89.0%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Pending Actions:</span>
              <span style={{ fontWeight: '600', color: '#eab308' }}>4 tasks</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button
          onClick={sendSos}
          style={{ width: '100%', padding: '12px', borderRadius: '12px', color: '#fff', fontWeight: 'bold', fontSize: '14px', transition: 'background-color 0.3s', backgroundColor: '#dc2626', border: 'none', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <AlertTriangle size={16} />
            SOS
          </div>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', backgroundColor: darkMode ? '#334155' : '#f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{getInitials(userProfile.name)}</div>
            <div>
              <p style={{ fontWeight: '600', fontSize: '14px' }}>{userProfile.name}</p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>{userProfile.role}</p>
            </div>
          </div>
          <button onClick={() => setActive('settings')} style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <Settings size={18} />
          </button>
        </div>
      </div>
      <footer style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
        <span>© 2024 AgriTech Pro</span>
      </footer>
    </aside>
  );
};

export default AgriTechDashboard;
