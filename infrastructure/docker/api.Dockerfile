FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@11.10.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @al-waheed/api db:generate
RUN pnpm --filter @al-waheed/api build

EXPOSE 4000
CMD ["pnpm", "--filter", "@al-waheed/api", "start"]
