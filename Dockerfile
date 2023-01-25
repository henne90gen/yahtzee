FROM node:16.19.0 AS builder

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN yarn install
RUN yarn run test-ci
RUN yarn build

FROM nginx:1.23.3-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
