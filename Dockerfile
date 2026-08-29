FROM node:22-alpine AS base
RUN apk add 'pnpm=~11'

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter news install
RUN pnpm run --filter news build
RUN pnpm deploy --filter=news --prod /prod/news

FROM base AS news
LABEL org.opencontainers.image.source=https://github.com/parlichart/parlichart
LABEL org.opencontainers.image.description="Parses news data and warns on MP changes"
LABEL org.opencontainers.image.licenses=MIT
COPY --from=build /prod/news /prod/news
WORKDIR /prod/news
EXPOSE 8000
CMD [ "node", "build/main.js" ]
