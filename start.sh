#!/bin/bash

echo "🚀 VPP 에너지 관리 시스템 시작"
echo "=================================="

# 백엔드 시작
echo "📡 백엔드 서버 시작 중..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!

# 잠시 대기
sleep 3

# 프론트엔드 시작
echo "🖥️  프론트엔드 애플리케이션 시작 중..."
cd ../frontend
npm install
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ 서비스가 시작되었습니다!"
echo "📊 대시보드: http://localhost:3000"
echo "🔧 API 서버: http://localhost:5000"
echo ""
echo "프로젝트를 중지하려면 Ctrl+C를 누르세요."

# 프로세스 종료 처리
trap "echo '🛑 서비스 종료 중...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# 프로세스 유지
wait 