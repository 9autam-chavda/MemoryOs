# ---------- Base Image ----------
FROM python:3.12-slim

# ---------- Prevent Python Buffering ----------
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# ---------- Install FFmpeg ----------
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# ---------- Working Directory ----------
WORKDIR /app

# ---------- Install Python Dependencies ----------
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# ---------- Copy Project ----------
COPY . .

# ---------- Expose FastAPI Port ----------
EXPOSE 8000

# ---------- Start Server ----------
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]