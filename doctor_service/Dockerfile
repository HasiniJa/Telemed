# ---------- build stage ----------
FROM node:18-bullseye AS build

# Create app directory
WORKDIR /usr/src/app

# Install dependencies (use package-lock.json if present for reproducible installs)
COPY package*.json ./
RUN npm ci --silent

# Copy source
COPY . .

# ---------- production stage ----------
FROM node:18-slim

# Create non-root user
RUN groupadd -r app && useradd -r -g app app

WORKDIR /usr/src/app

# Copy only installed node_modules from build stage for smaller final image
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app ./

# Expose the port your app listens on
ENV PORT=5000
EXPOSE 5000

# Run as non-root
USER app

# Healthcheck (optional): checks your root route
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1:5000/ || exit 1

# Start the app
CMD ["node", "src/index.js"]
