FROM node:18-alpine

WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 5000

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=5000

# 애플리케이션 실행
CMD ["npm", "start"] 