# 构建阶段
FROM node:24-alpine AS builder

WORKDIR /app

# 安装 git（vitepress 需要）
RUN apk add --no-cache git

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# 复制源代码并构建文档站
COPY . .
RUN pnpm docs:build

# 运行阶段
FROM caddy:alpine

# 复制构建产物
COPY --from=builder /app/docs/.vitepress/dist /docs

EXPOSE 80

CMD ["caddy", "file-server", "--root", "/docs", "--listen", ":80"]
