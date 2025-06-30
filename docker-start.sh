#!/bin/bash

echo "🚀 VPP 에너지 관리 시스템 Docker 시작"
echo "======================================"

# Docker Compose로 서비스 시작
echo "📦 Docker 컨테이너 빌드 및 시작 중..."
docker-compose up --build -d

# 서비스 상태 확인
echo ""
echo "📊 서비스 상태 확인 중..."
sleep 10

# 컨테이너 상태 확인
echo "🔍 컨테이너 상태:"
docker-compose ps

# 로그 확인
echo ""
echo "📋 최근 로그:"
docker-compose logs --tail=20

echo ""
echo "✅ 서비스가 시작되었습니다!"
echo "🌐 프론트엔드: http://localhost"
echo "🔧 백엔드 API: http://localhost:5000"
echo ""
echo "📝 유용한 명령어:"
echo "  - 로그 확인: docker-compose logs -f"
echo "  - 서비스 중지: docker-compose down"
echo "  - 서비스 재시작: docker-compose restart"
echo "  - 개발 모드: docker-compose --profile dev up --build -d" 