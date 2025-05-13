# Stage 1: Build the app
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Run the app
FROM node:20-slim

WORKDIR /app

# Copy compiled JS and necessary files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./
COPY --from=builder /app/.env.dev ./
COPY --from=builder /app/.env.prod ./

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
