# Stage 1: Build React frontend
FROM node:18 AS frontend-builder
WORKDIR /app
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build FastAPI backend
FROM python:3.10 AS backend
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./

# Copy React build to FastAPI static files
COPY --from=frontend-builder /app/build ./static

# Expose port and run FastAPI app
EXPOSE 8000
CMD ["uvicorn", "index:app", "--host", "0.0.0.0", "--port", "8000"]