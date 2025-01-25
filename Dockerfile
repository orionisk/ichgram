FROM node:22-slim AS build

ARG APP_WORKDIR=/var/www

WORKDIR $APP_WORKDIR

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.json ./
COPY apps/api/package.json ./apps/api/package.json

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm
RUN --mount=type=cache,id=pnpm,target=$APP_WORKDIR/pnpm/store pnpm install --frozen-lockfile

COPY --chown=node:node apps/api /$APP_WORKDIR/apps/api
RUN pnpm api prisma:generate
RUN pnpm api build

FROM node:22-slim
ARG APP_WORKDIR=/var/www
ENV NODE_ENV production

WORKDIR $APP_WORKDIR

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --chown=node:node --link --from=build  $APP_WORKDIR/apps/api/dist ./apps/api/dist
COPY --chown=node:node --link --from=build  $APP_WORKDIR/apps/api/package.json ./apps/api/package.json
COPY --chown=node:node --link --from=build  $APP_WORKDIR/apps/api/prisma ./apps/api/prisma
COPY --chown=node:node --link package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN npm install -g pnpm
RUN --mount=type=cache,id=pnpm,target=$APP_WORKDIR/pnpm/store pnpm install --frozen-lockfile --production
RUN pnpm api prisma:generate

EXPOSE 3000

CMD [ "pnpm", "api", "start" ]
