# Stage 1: Frontend Build
FROM node:lts-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ .
RUN npm run build

# Stage 2: Backend Build
FROM node:lts-slim AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY --from=frontend-build /app/frontend/dist /app/backend/public
COPY backend/ .
ENV PORT 8080
EXPOSE 8080

# Final Stage: Combine Frontend and Backend
FROM backend-build
CMD ["npm", "start"]