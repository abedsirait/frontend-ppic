# Step 1: Gunakan image Node.js untuk membangun aplikasi
FROM node:18-alpine AS builder

# Set working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

ENV REACT_APP_API_URL="https://backend-ppic-47429645215.asia-southeast2.run.app"
# Salin semua file ke dalam container
COPY . .

# Build aplikasi React
RUN npm run build

# Step 2: Gunakan Nginx untuk menyajikan aplikasi React
FROM nginx:stable-alpine

# Salin build hasil dari tahap builder ke dalam Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 agar bisa diakses
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
