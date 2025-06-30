const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 데이터베이스 초기화
const db = new sqlite3.Database('./vpp_energy.db');

// 테이블 생성
db.serialize(() => {
  // 발전소 정보 테이블
  db.run(`CREATE TABLE IF NOT EXISTS power_plants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    capacity REAL NOT NULL,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 에너지 생산 데이터 테이블
  db.run(`CREATE TABLE IF NOT EXISTS energy_production (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plant_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    power_output REAL NOT NULL,
    efficiency REAL,
    temperature REAL,
    FOREIGN KEY (plant_id) REFERENCES power_plants (id)
  )`);

  // VPP 운영 데이터 테이블
  db.run(`CREATE TABLE IF NOT EXISTS vpp_operations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_demand REAL NOT NULL,
    total_supply REAL NOT NULL,
    grid_frequency REAL,
    battery_level REAL,
    status TEXT DEFAULT 'normal'
  )`);
});

// 샘플 데이터 삽입
const insertSampleData = () => {
  // 발전소 데이터 - 더 현실적인 정보
  const plants = [
    { name: '부산 태양광 발전소 A', type: 'solar', capacity: 50.0, location: '부산광역시 기장군' },
    { name: '제주 풍력 발전소 B', type: 'wind', capacity: 30.0, location: '제주특별자치도 서귀포시' },
    { name: '울산 배터리 저장소 C', type: 'battery', capacity: 20.0, location: '울산광역시 남구' },
    { name: '강원 수력 발전소 D', type: 'hydro', capacity: 40.0, location: '강원도 춘천시' },
    { name: '전남 태양광 발전소 E', type: 'solar', capacity: 35.0, location: '전라남도 여수시' },
    { name: '경북 풍력 발전소 F', type: 'wind', capacity: 25.0, location: '경상북도 포항시' },
    { name: '충남 배터리 저장소 G', type: 'battery', capacity: 15.0, location: '충청남도 천안시' },
    { name: '경남 수력 발전소 H', type: 'hydro', capacity: 30.0, location: '경상남도 창원시' }
  ];

  plants.forEach(plant => {
    db.run(`INSERT OR IGNORE INTO power_plants (name, type, capacity, location) VALUES (?, ?, ?, ?)`,
      [plant.name, plant.type, plant.capacity, plant.location]);
  });

  // 과거 에너지 생산 데이터 추가 (최근 24시간)
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    
    plants.forEach((plant, plantIndex) => {
      const plantId = plantIndex + 1;
      let powerOutput, efficiency, temperature;
      
      // 발전소 타입별 현실적인 데이터 생성
      switch (plant.type) {
        case 'solar':
          // 태양광: 시간대별 생산량 변화 (정오에 최대)
          const hour = timestamp.getHours();
          const solarFactor = hour >= 6 && hour <= 18 ? 
            Math.sin((hour - 6) * Math.PI / 12) * 0.8 + 0.2 : 0;
          powerOutput = plant.capacity * solarFactor * (0.7 + Math.random() * 0.3);
          efficiency = 75 + Math.random() * 15;
          temperature = 20 + Math.random() * 30;
          break;
          
        case 'wind':
          // 풍력: 랜덤하지만 연속적인 변화
          powerOutput = plant.capacity * (0.3 + Math.random() * 0.6);
          efficiency = 70 + Math.random() * 20;
          temperature = 15 + Math.random() * 20;
          break;
          
        case 'battery':
          // 배터리: 충방전 패턴
          const batteryLevel = 30 + Math.random() * 40;
          powerOutput = plant.capacity * (batteryLevel / 100) * (0.8 + Math.random() * 0.4);
          efficiency = 85 + Math.random() * 10;
          temperature = 25 + Math.random() * 10;
          break;
          
        case 'hydro':
          // 수력: 안정적인 생산
          powerOutput = plant.capacity * (0.6 + Math.random() * 0.3);
          efficiency = 80 + Math.random() * 15;
          temperature = 10 + Math.random() * 15;
          break;
      }
      
      db.run(`INSERT INTO energy_production (plant_id, power_output, efficiency, temperature, timestamp) 
              VALUES (?, ?, ?, ?, ?)`, 
        [plantId, powerOutput, efficiency, temperature, timestamp.toISOString()]);
    });
  }

  // 과거 VPP 운영 데이터 추가
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    
    // 시간대별 수요 패턴 (아침/저녁 피크)
    const hour = timestamp.getHours();
    let baseDemand = 80;
    if (hour >= 7 && hour <= 9) baseDemand = 120; // 아침 피크
    else if (hour >= 18 && hour <= 21) baseDemand = 140; // 저녁 피크
    else if (hour >= 22 || hour <= 6) baseDemand = 60; // 야간 최소
    
    const totalDemand = baseDemand + Math.random() * 20;
    const totalSupply = totalDemand + (Math.random() * 30 - 15);
    const gridFrequency = 60 + (Math.random() * 0.1 - 0.05);
    const batteryLevel = 20 + Math.random() * 60;
    
    db.run(`INSERT INTO vpp_operations (total_demand, total_supply, grid_frequency, battery_level, status, timestamp) 
            VALUES (?, ?, ?, ?, ?, ?)`, 
      [totalDemand, totalSupply, gridFrequency, batteryLevel, 'normal', timestamp.toISOString()]);
  }
};

insertSampleData();

// API 라우트

// 모든 발전소 조회
app.get('/api/power-plants', (req, res) => {
  db.all('SELECT * FROM power_plants ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 특정 발전소의 에너지 생산 데이터 조회
app.get('/api/energy-production/:plantId', (req, res) => {
  const plantId = req.params.plantId;
  const limit = req.query.limit || 100;
  
  db.all(`SELECT * FROM energy_production 
          WHERE plant_id = ? 
          ORDER BY timestamp DESC 
          LIMIT ?`, [plantId, limit], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// VPP 운영 데이터 조회
app.get('/api/vpp-operations', (req, res) => {
  const limit = req.query.limit || 50;
  
  db.all(`SELECT * FROM vpp_operations 
          ORDER BY timestamp DESC 
          LIMIT ?`, [limit], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 실시간 에너지 생산 데이터 추가
app.post('/api/energy-production', (req, res) => {
  const { plant_id, power_output, efficiency, temperature } = req.body;
  
  db.run(`INSERT INTO energy_production (plant_id, power_output, efficiency, temperature) 
          VALUES (?, ?, ?, ?)`, [plant_id, power_output, efficiency, temperature], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Socket.IO를 통해 실시간 업데이트 전송
    io.emit('energy-production-update', {
      id: this.lastID,
      plant_id,
      power_output,
      efficiency,
      temperature,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    });
    
    res.json({ id: this.lastID, message: '데이터가 성공적으로 추가되었습니다.' });
  });
});

// VPP 운영 데이터 추가
app.post('/api/vpp-operations', (req, res) => {
  const { total_demand, total_supply, grid_frequency, battery_level, status } = req.body;
  
  db.run(`INSERT INTO vpp_operations (total_demand, total_supply, grid_frequency, battery_level, status) 
          VALUES (?, ?, ?, ?, ?)`, [total_demand, total_supply, grid_frequency, battery_level, status], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Socket.IO를 통해 실시간 업데이트 전송
    io.emit('vpp-operation-update', {
      id: this.lastID,
      total_demand,
      total_supply,
      grid_frequency,
      battery_level,
      status,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    });
    
    res.json({ id: this.lastID, message: 'VPP 운영 데이터가 성공적으로 추가되었습니다.' });
  });
});

// 통계 데이터 조회
app.get('/api/statistics', (req, res) => {
  const queries = {
    totalPlants: 'SELECT COUNT(*) as count FROM power_plants',
    totalCapacity: 'SELECT SUM(capacity) as total FROM power_plants',
    activePlants: 'SELECT COUNT(*) as count FROM power_plants WHERE status = "active"',
    todayProduction: `SELECT SUM(power_output) as total FROM energy_production 
                      WHERE DATE(timestamp) = DATE('now')`
  };

  const results = {};
  let completed = 0;
  const totalQueries = Object.keys(queries).length;

  Object.keys(queries).forEach(key => {
    db.get(queries[key], (err, row) => {
      if (err) {
        results[key] = { error: err.message };
      } else {
        results[key] = row;
      }
      completed++;
      
      if (completed === totalQueries) {
        res.json(results);
      }
    });
  });
});

// Socket.IO 연결 처리
io.on('connection', (socket) => {
  console.log('클라이언트가 연결되었습니다:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('클라이언트가 연결을 해제했습니다:', socket.id);
  });
});

// 실시간 데이터 시뮬레이션 (30초마다)
setInterval(() => {
  const now = new Date();
  const hour = now.getHours();
  
  // 발전소별 현실적인 데이터 생성
  const plantIds = [1, 2, 3, 4, 5, 6, 7, 8];
  const randomPlantId = plantIds[Math.floor(Math.random() * plantIds.length)];
  
  // 발전소 타입별 현실적인 데이터
  let powerOutput, efficiency, temperature;
  
  // 발전소 타입 확인
  db.get('SELECT type, capacity FROM power_plants WHERE id = ?', [randomPlantId], (err, plant) => {
    if (err || !plant) return;
    
    switch (plant.type) {
      case 'solar':
        // 태양광: 시간대별 생산량 변화
        const solarFactor = hour >= 6 && hour <= 18 ? 
          Math.sin((hour - 6) * Math.PI / 12) * 0.8 + 0.2 : 0;
        powerOutput = plant.capacity * solarFactor * (0.7 + Math.random() * 0.3);
        efficiency = 75 + Math.random() * 15;
        temperature = 20 + Math.random() * 30;
        break;
        
      case 'wind':
        // 풍력: 랜덤하지만 연속적인 변화
        powerOutput = plant.capacity * (0.3 + Math.random() * 0.6);
        efficiency = 70 + Math.random() * 20;
        temperature = 15 + Math.random() * 20;
        break;
        
      case 'battery':
        // 배터리: 충방전 패턴
        const batteryLevel = 30 + Math.random() * 40;
        powerOutput = plant.capacity * (batteryLevel / 100) * (0.8 + Math.random() * 0.4);
        efficiency = 85 + Math.random() * 10;
        temperature = 25 + Math.random() * 10;
        break;
        
      case 'hydro':
        // 수력: 안정적인 생산
        powerOutput = plant.capacity * (0.6 + Math.random() * 0.3);
        efficiency = 80 + Math.random() * 15;
        temperature = 10 + Math.random() * 15;
        break;
    }
    
    db.run(`INSERT INTO energy_production (plant_id, power_output, efficiency, temperature) 
            VALUES (?, ?, ?, ?)`, [randomPlantId, powerOutput, efficiency, temperature], function(err) {
      if (!err) {
        io.emit('energy-production-update', {
          id: this.lastID,
          plant_id: randomPlantId,
          power_output: powerOutput,
          efficiency: efficiency,
          temperature: temperature,
          timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
        });
      }
    });
  });
  
  // VPP 운영 데이터 생성 - 시간대별 현실적인 패턴
  let baseDemand = 80;
  if (hour >= 7 && hour <= 9) baseDemand = 120; // 아침 피크
  else if (hour >= 18 && hour <= 21) baseDemand = 140; // 저녁 피크
  else if (hour >= 22 || hour <= 6) baseDemand = 60; // 야간 최소
  
  const totalDemand = baseDemand + Math.random() * 20;
  const totalSupply = totalDemand + (Math.random() * 30 - 15);
  const gridFrequency = 60 + (Math.random() * 0.1 - 0.05);
  const batteryLevel = 20 + Math.random() * 60;
  
  // 상태 결정 (수요/공급 균형에 따라)
  let status = 'normal';
  const balance = totalSupply - totalDemand;
  if (Math.abs(balance) > 20) status = 'warning';
  if (Math.abs(balance) > 40) status = 'critical';
  
  db.run(`INSERT INTO vpp_operations (total_demand, total_supply, grid_frequency, battery_level, status) 
          VALUES (?, ?, ?, ?, ?)`, [totalDemand, totalSupply, gridFrequency, batteryLevel, status], function(err) {
    if (!err) {
      io.emit('vpp-operation-update', {
        id: this.lastID,
        total_demand: totalDemand,
        total_supply: totalSupply,
        grid_frequency: gridFrequency,
        battery_level: batteryLevel,
        status: status,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
      });
    }
  });
}, 30000);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`VPP 에너지 관리 시스템 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`API 서버: http://localhost:${PORT}`);
  console.log(`웹소켓 서버: ws://localhost:${PORT}`);
}); 