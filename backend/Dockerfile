FROM node:18-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy source code
COPY src/ src/

# Create uploads directory
RUN mkdir -p uploads

# Build TypeScript code
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "dist/server.js"] 