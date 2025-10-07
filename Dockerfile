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

# 创建非 root 用户和组
RUN addgroup -g 1001 -S nginx && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# 删除默认的 nginx 配置
RUN rm -rf /usr/share/nginx/html/*

# 从构建阶段复制构建好的文件到 nginx 的静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义的 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 创建必要的目录并设置权限
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp /var/log/nginx /var/run && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/run \
    /usr/share/nginx/html /etc/nginx/conf.d

# 修改 nginx 配置以使用非特权端口
RUN sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# 切换到非 root 用户
USER nginx

# 暴露 8080 端口（非特权端口）
EXPOSE 8080

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]