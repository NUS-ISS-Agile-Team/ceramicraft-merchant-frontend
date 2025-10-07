# 多阶段构建：第一阶段 - 构建应用
FROM node:24.6.0-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖，构建需要）
RUN npm ci --ignore-scripts

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 第二阶段 - 生产环境镜像
FROM nginx:alpine

# 删除默认的 nginx 配置
RUN rm -rf /usr/share/nginx/html/*

# 从构建阶段复制构建好的文件到 nginx 的静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义的 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]