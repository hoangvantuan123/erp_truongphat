# Giai đoạn 1: Build
FROM node:20-alpine as build

WORKDIR /app

# Sao chép package.json và yarn.lock trước để tận dụng Docker cache khi cài đặt dependencies
COPY package*.json yarn.lock ./ 

# Cài đặt các dependencies cần thiết cho build
RUN yarn install --frozen-lockfile

# Sao chép tất cả các tệp còn lại và build ứng dụng
COPY . . 

# Build ứng dụng
RUN yarn run build

# Dọn dẹp cache và node_modules không cần thiết để giảm kích thước image
RUN yarn cache clean && rm -rf /root/.cache /app/node_modules

# Giai đoạn 2: Production
FROM node:20-alpine

WORKDIR /app

# Cài đặt LibreOffice trên Alpine
RUN apk update && apk add --no-cache libreoffice

# Sao chép package.json và yarn.lock từ build để cài đặt dependencies sản xuất
COPY package*.json yarn.lock ./ 

# Cài đặt dependencies cho môi trường production
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Sao chép thư mục dist từ giai đoạn build sang image production
COPY --from=build /app/dist ./dist

# Set PORT environment variable
ENV PORT=8089

# Expose cổng 8089 mà ứng dụng đang lắng nghe
EXPOSE 8089

# Chạy ứng dụng dưới dạng microservice (NestJS)
CMD ["node", "dist/main.js"]
