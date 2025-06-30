// API 설정
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// WebSocket URL
export const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:5000';

// API 엔드포인트
export const API_ENDPOINTS = {
  POWER_PLANTS: `${API_BASE_URL}/api/power-plants`,
  ENERGY_PRODUCTION: `${API_BASE_URL}/api/energy-production`,
  VPP_OPERATIONS: `${API_BASE_URL}/api/vpp-operations`,
  STATISTICS: `${API_BASE_URL}/api/statistics`,
}; 