# Build the React frontend first.
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Run the FastAPI backend and serve the built frontend from the same container.
FROM python:3.12-slim AS app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    SERVER_HOST=0.0.0.0 \
    SERVER_PORT=8000 \
    USER_DB_PATH=data/server.db \
    SAMPLE_GRAPH=/app/sample_graph.csv
WORKDIR /app

COPY pyproject.toml README.md ./
COPY app ./app
COPY server ./server
COPY skills ./skills
COPY data/sample_graph.csv ./sample_graph.csv
RUN pip install --upgrade pip && pip install .

COPY --from=frontend-build /frontend/dist ./frontend/dist
RUN mkdir -p /app/data /app/data/uploads

EXPOSE 8000
CMD ["sh", "-c", "uvicorn server.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
