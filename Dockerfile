FROM node:18-alpine
WORKDIR /app

# install backend dependencies
COPY backend/package*.json backend/
RUN cd backend && npm install

# copy source
COPY backend/ backend/
COPY frontend/ frontend/

EXPOSE 3000
CMD ["node", "backend/server.js"]

