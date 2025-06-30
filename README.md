# VPP 에너지 관리 시스템

가상발전소(VPP) 운영 모니터링 웹 애플리케이션

## 📋 프로젝트 개요

이 프로젝트는 에너지 관리 시스템의 실무 적용을 학습하고 포트폴리오로 제작된 가상발전소(VPP) 운영 모니터링 웹 애플리케이션입니다.

### 주요 기능
- **실시간 에너지 모니터링**: 발전소별 실시간 생산량 및 효율성 추적
- **VPP 운영 대시보드**: 수요/공급 균형, 그리드 주파수 모니터링
- **발전소 관리**: 태양광, 풍력, 배터리, 수력 발전소 통합 관리
- **통계 분석**: 에너지 생산 통계 및 성과 지표 분석
- **실시간 알림**: Socket.IO를 통한 실시간 데이터 업데이트

## 🛠 기술 스택

### Frontend
- **React 18** with TypeScript
- **Recharts** - 데이터 시각화
- **Socket.IO Client** - 실시간 통신
- **CSS3** - 모던 UI/UX 디자인

### Backend
- **Node.js** with Express
- **SQLite3** - 데이터베이스
- **Socket.IO** - 실시간 웹소켓 통신
- **Moment.js** - 날짜/시간 처리

## 🚀 설치 및 실행

### 사전 요구사항
- Node.js 16.0 이상
- npm 또는 yarn

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd vpp-energy-system
```

### 2. 백엔드 설정
```bash
cd backend
npm install
npm run dev
```

백엔드 서버가 `http://localhost:5000`에서 실행됩니다.

### 3. 프론트엔드 설정
```bash
cd frontend
npm install
npm start
```

프론트엔드 애플리케이션이 `http://localhost:3000`에서 실행됩니다.

## 📊 주요 화면

### 1. 대시보드
- 실시간 수요/공급 현황
- 발전소 타입별 분포 (파이 차트)
- 주요 통계 지표
- 그리드 주파수 모니터링

### 2. 발전소 관리
- 발전소 목록 및 상세 정보
- 발전소별 에너지 생산 데이터
- 효율성 및 온도 모니터링

### 3. VPP 운영
- 실시간 운영 상태
- 수요/공급 균형 차트
- 배터리 저장소 레벨
- 운영 로그

### 4. 통계 분석
- 시간대별 생산량
- 발전소별 효율성
- 에너지 믹스 분포
- 성과 지표

## 🔧 API 엔드포인트

### 발전소 관련
- `GET /api/power-plants` - 모든 발전소 조회
- `GET /api/energy-production/:plantId` - 특정 발전소 생산 데이터
- `POST /api/energy-production` - 에너지 생산 데이터 추가

### VPP 운영 관련
- `GET /api/vpp-operations` - VPP 운영 데이터 조회
- `POST /api/vpp-operations` - VPP 운영 데이터 추가

### 통계 관련
- `GET /api/statistics` - 통계 데이터 조회

## 📈 데이터베이스 스키마

### power_plants (발전소 정보)
- id: 발전소 고유 ID
- name: 발전소명
- type: 발전소 타입 (solar, wind, battery, hydro)
- capacity: 설비용량 (MW)
- location: 위치
- status: 상태 (active, inactive)

### energy_production (에너지 생산 데이터)
- id: 데이터 고유 ID
- plant_id: 발전소 ID
- timestamp: 시간
- power_output: 발전 출력 (MW)
- efficiency: 효율성 (%)
- temperature: 온도 (°C)

### vpp_operations (VPP 운영 데이터)
- id: 데이터 고유 ID
- timestamp: 시간
- total_demand: 총 수요 (MW)
- total_supply: 총 공급 (MW)
- grid_frequency: 그리드 주파수 (Hz)
- battery_level: 배터리 레벨 (%)
- status: 운영 상태

## 🎯 프로젝트 특징

### 1. 실무 연관성
- 실제 VPP 운영 환경을 반영한 시스템 설계
- 에너지 산업의 핵심 개념과 기술 적용
- 실무에서 활용 가능한 기능 구현

### 2. 기술적 완성도
- React + Node.js 풀스택 개발
- 실시간 데이터 처리 및 시각화
- 반응형 웹 디자인

### 3. 확장성
- 모듈화된 컴포넌트 구조
- RESTful API 설계
- 실시간 통신 구현

### 4. 사용자 경험
- 직관적인 대시보드
- 실시간 데이터 업데이트
- 모던한 UI/UX 디자인

## 🔮 향후 개선 방향

1. **인증 시스템**: 사용자 로그인 및 권한 관리
2. **알림 시스템**: 이상 상황 실시간 알림
3. **모바일 앱**: React Native 기반 모바일 애플리케이션
4. **AI 예측**: 머신러닝을 통한 에너지 수요 예측
5. **블록체인**: 에너지 거래 기록 관리

## 📝 개발자 정보

- **목적**: 에너지 관리 시스템 포트폴리오 프로젝트
- **기술 스택**: React, Node.js, TypeScript, SQLite
- **개발 기간**: 2024년
- **프로젝트 유형**: 학습 및 포트폴리오 프로젝트

## 📄 라이선스

이 프로젝트는 학습 및 포트폴리오 목적으로 제작되었습니다.

---

**VPP 에너지 관리 시스템** - 미래의 에너지 생태계를 위한 혁신적인 솔루션 