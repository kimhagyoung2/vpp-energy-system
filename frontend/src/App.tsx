import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import PowerPlants from './components/PowerPlants';
import VPPOperations from './components/VPPOperations';
import Statistics from './components/Statistics';
import Navigation from './components/Navigation';
import { API_ENDPOINTS } from './config/api';

// API URL을 환경 변수에서 가져오거나 기본값 사용
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface PowerPlant {
  id: number;
  name: string;
  type: string;
  capacity: number;
  location: string;
  status: string;
  created_at: string;
}

export interface EnergyProduction {
  id: number;
  plant_id: number;
  timestamp: string;
  power_output: number;
  efficiency: number;
  temperature: number;
}

export interface VPPOperation {
  id: number;
  timestamp: string;
  total_demand: number;
  total_supply: number;
  grid_frequency: number;
  battery_level: number;
  status: string;
}

export interface StatsData {
  totalPlants: { count: number };
  totalCapacity: { total: number };
  activePlants: { count: number };
  todayProduction: { total: number };
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [powerPlants, setPowerPlants] = useState<PowerPlant[]>([]);
  const [vppOperations, setVppOperations] = useState<VPPOperation[]>([]);
  const [statistics, setStatistics] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [plantsRes, operationsRes, statsRes] = await Promise.all([
        fetch(API_ENDPOINTS.POWER_PLANTS),
        fetch(API_ENDPOINTS.VPP_OPERATIONS),
        fetch(API_ENDPOINTS.STATISTICS)
      ]);

      const plants = await plantsRes.json();
      const operations = await operationsRes.json();
      const stats = await statsRes.json();

      setPowerPlants(plants);
      setVppOperations(operations);
      setStatistics(stats);
      setLoading(false);
    } catch (error) {
      console.error('데이터 로딩 중 오류:', error);
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>데이터를 로딩 중입니다...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard powerPlants={powerPlants} vppOperations={vppOperations} statistics={statistics} />;
      case 'power-plants':
        return <PowerPlants powerPlants={powerPlants} />;
      case 'vpp-operations':
        return <VPPOperations vppOperations={vppOperations} />;
      case 'statistics':
        return <Statistics statistics={statistics} />;
      default:
        return <Dashboard powerPlants={powerPlants} vppOperations={vppOperations} statistics={statistics} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>VPP 에너지 관리 시스템</h1>
        <p>가상발전소(VPP) 운영 모니터링 대시보드</p>
      </header>
      
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="App-main">
        {renderContent()}
      </main>
      
      <footer className="App-footer">
        <p>&copy; 2024 VPP Energy Management System - 포트폴리오 프로젝트</p>
      </footer>
    </div>
  );
}

export default App; 