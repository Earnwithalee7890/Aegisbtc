FROM python:3.10-slim

WORKDIR /app

# Install dependencies before copying code to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy main code
COPY . .

# Run uvicorn on a production server setup
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
