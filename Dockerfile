# Stage 1: Build Vite application
FROM node:24-alpine as builder

WORKDIR /app

COPY package-lock.json
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]