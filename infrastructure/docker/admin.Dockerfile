FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@11.10.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/ ./packages/
COPY apps/admin/ ./apps/admin/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @al-waheed/admin build

EXPOSE 3001
CMD ["pnpm", "--filter", "@al-waheed/admin", "start"]
