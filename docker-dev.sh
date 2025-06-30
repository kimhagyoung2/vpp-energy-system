#!/bin/bash

echo "🚀 VPP 에너지 관리 시스템 Docker 개발 모드 시작"
echo "=============================================="

# 개발 모드로 Docker Compose 실행
echo "📦 개발용 Docker 컨테이너 빌드 및 시작 중..."
docker-compose --profile dev up --build -d

# 서비스 상태 확인
echo ""
echo "📊 서비스 상태 확인 중..."
sleep 10

# 컨테이너 상태 확인
echo "🔍 컨테이너 상태:"
docker-compose --profile dev ps

# 로그 확인
echo ""
echo "📋 최근 로그:"
docker-compose --profile dev logs --tail=20

echo ""
echo "✅ 개발 서비스가 시작되었습니다!"
echo "🌐 프론트엔드: http://localhost:3000"
echo "🔧 백엔드 API: http://localhost:5001"
echo ""
echo "📝 개발 모드 특징:"
echo "  - 핫 리로드 지원"
echo "  - 소스 코드 변경 시 자동 반영"
echo "  - 개발 도구 활성화"
echo ""
echo "📝 유용한 명령어:"
echo "  - 로그 확인: docker-compose --profile dev logs -f"
echo "  - 서비스 중지: docker-compose --profile dev down"
echo "  - 서비스 재시작: docker-compose --profile dev restart" 