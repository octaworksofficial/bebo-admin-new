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

# Production stage - using nginx to serve static files
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
