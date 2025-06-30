# Render 배포 가이드

VPP 에너지 관리 시스템을 Render 플랫폼에 배포하는 방법을 안내합니다.

## 🚀 Render 배포 단계

### 1. Render 계정 생성
- [Render.com](https://render.com)에 접속하여 계정을 생성합니다.
- GitHub 계정으로 로그인하는 것을 권장합니다.

### 2. GitHub 저장소 연결
1. Render 대시보드에서 "New +" 버튼 클릭
2. "Blueprint" 선택
3. GitHub 저장소 연결: `kimhagyoung2/vpp-energy-system`
4. "Connect" 클릭

### 3. Blueprint 배포 설정
- `render.yaml` 파일이 자동으로 인식됩니다.
- 다음 두 서비스가 생성됩니다:
  - **vpp-energy-backend**: Node.js API 서버
  - **vpp-energy-frontend**: React 정적 웹사이트

### 4. 환경 변수 확인
백엔드 서비스에서 다음 환경 변수가 자동 설정됩니다:
- `NODE_ENV=production`
- `PORT=10000`

프론트엔드 서비스에서 다음 환경 변수가 자동 설정됩니다:
- `REACT_APP_API_URL=https://vpp-energy-backend.onrender.com`
- `REACT_APP_WS_URL=https://vpp-energy-backend.onrender.com`

### 5. 배포 실행
1. "Create New Resources" 클릭
2. 배포가 자동으로 시작됩니다 (약 5-10분 소요)
3. 배포 완료 후 제공되는 URL로 접속

## 📋 배포된 서비스 URL

배포 완료 후 다음 URL로 접속할 수 있습니다:

- **프론트엔드**: `https://vpp-energy-frontend.onrender.com`
- **백엔드 API**: `https://vpp-energy-backend.onrender.com`

## 🔧 수동 배포 방법 (Blueprint 사용하지 않는 경우)

### 백엔드 서비스 수동 생성
1. "New +" → "Web Service" 선택
2. GitHub 저장소 연결
3. 설정:
   - **Name**: `vpp-energy-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Health Check Path**: `/api/power-plants`

### 프론트엔드 서비스 수동 생성
1. "New +" → "Static Site" 선택
2. GitHub 저장소 연결
3. 설정:
   - **Name**: `vpp-energy-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`

## 🌐 환경 변수 설정

### 백엔드 환경 변수
```
NODE_ENV=production
PORT=10000
```

### 프론트엔드 환경 변수
```
REACT_APP_API_URL=https://vpp-energy-backend.onrender.com
REACT_APP_WS_URL=https://vpp-energy-backend.onrender.com
```

## 📊 배포 상태 확인

### 배포 로그 확인
1. Render 대시보드에서 서비스 선택
2. "Logs" 탭에서 실시간 로그 확인
3. 배포 과정에서 오류 발생 시 로그를 통해 디버깅

### 헬스 체크
- 백엔드: `https://vpp-energy-backend.onrender.com/api/power-plants`
- 정상 응답 시 JSON 형태의 발전소 데이터 반환

## 🔄 자동 배포

GitHub 저장소에 코드를 푸시하면 자동으로 재배포됩니다:
```bash
git add .
git commit -m "업데이트 내용"
git push origin main
```

## 🛠 문제 해결

### 일반적인 문제들

1. **빌드 실패**
   - 로그에서 오류 메시지 확인
   - 의존성 설치 문제일 수 있음

2. **환경 변수 오류**
   - 환경 변수가 올바르게 설정되었는지 확인
   - 프론트엔드에서 백엔드 API에 접근할 수 있는지 확인

3. **포트 충돌**
   - Render는 자동으로 포트를 할당하므로 PORT 환경 변수만 설정

4. **WebSocket 연결 실패**
   - HTTPS 환경에서 WSS 프로토콜 사용 필요
   - Render는 자동으로 HTTPS 제공

### 지원
- Render 문서: https://render.com/docs
- GitHub Issues: https://github.com/kimhagyoung2/vpp-energy-system/issues

## 🎯 배포 완료 후 확인사항

1. **프론트엔드 접속**: 메인 페이지 로딩 확인
2. **백엔드 API 테스트**: 발전소 데이터 API 호출 확인
3. **실시간 기능**: WebSocket 연결 및 실시간 데이터 업데이트 확인
4. **모바일 반응형**: 다양한 디바이스에서 UI 확인

---

**VPP 에너지 관리 시스템** - Render를 통한 클라우드 배포 완료! 🚀 