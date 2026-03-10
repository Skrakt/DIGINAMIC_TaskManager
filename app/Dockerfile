FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Detect Angular build output by locating index.html in dist and stage it for nginx.
RUN set -eux; \
  DIST_DIR="$(find dist -type f -name index.html | head -n 1 | xargs -r dirname)"; \
  if [ -z "$DIST_DIR" ]; then \
    echo "Angular dist output not found under dist/"; \
    exit 1; \
  fi; \
  mkdir -p /tmp/nginx-html; \
  cp -r "$DIST_DIR"/. /tmp/nginx-html/

FROM nginx:alpine

COPY --from=build /tmp/nginx-html/ /usr/share/nginx/html/

EXPOSE 80
