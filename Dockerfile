FROM docker/compose:1.29.2

WORKDIR /app

# Copy the entire project
COPY . .

# Start services using Docker Compose
CMD ["docker-compose", "up"] 