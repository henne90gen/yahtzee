FROM node:16.13.1 AS builder

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN yarn install && yarn build

FROM nginx:1.21.6-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
