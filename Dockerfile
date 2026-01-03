# Use Node.js LTS version
FROM node:20-alpine

# Install netcat for wait script
RUN apk add --no-cache netcat-openbsd

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove devDependencies
RUN npm prune --production

# Expose port (adjust if your app uses a different port)
EXPOSE 3000

# Start the application with wait for postgres
CMD ["sh", "-c", "while ! nc -z postgres 5432; do sleep 1; done && npm start"]
