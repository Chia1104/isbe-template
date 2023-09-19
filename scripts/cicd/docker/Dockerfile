# syntax = docker/dockerfile:1.2

FROM --platform=linux/amd64 node:18-alpine AS build
WORKDIR /usr/src/app
RUN apk add --no-cache git
COPY . .
RUN --mount=type=secret,id=gitcredentials,required \
    git config --global credential.helper 'store' \
    && cat /run/secrets/gitcredentials | git credential approve \
    && sed -i "s|github:LeadBest|git+https://github.com/LeadBest|" package.json \
    && yarn install \
    && npm run app:build

FROM --platform=linux/amd64 nginx:mainline-alpine
ENV CSP_FRAME_ANCESTORS_HOSTS=http://127.0.0.1
COPY --chown=root:root --chmod=0755 ./scripts/cicd/docker/30-config-mover.sh /docker-entrypoint.d/30-config-mover.sh
COPY --chown=root:root ./scripts/cicd/docker/nginx.conf /etc/nginx/nginx.conf
COPY --chown=root:root ./scripts/cicd/docker/templates/ /etc/nginx/templates
COPY --chown=nginx:nginx --from=build /usr/src/app/dist/ /usr/share/nginx/dist/
