# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (skip postinstall scripts)
RUN npm ci --legacy-peer-deps --ignore-scripts

# Copy source code
COPY . .

# Run Angular compatibility compiler
RUN ./node_modules/.bin/ngcc --properties es2015 browser module main --first-only --create-ivy-entry-points || true

# Build the Angular app for production
RUN npm run build -- --configuration=production

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies
RUN npm install express compression

# Copy built app from build stage
COPY --from=build /app/dist ./dist

# Copy server file
COPY server.js ./

# Railway uses dynamic PORT
ENV PORT=80
EXPOSE 80

# Start the server
CMD ["node", "server.js"]
