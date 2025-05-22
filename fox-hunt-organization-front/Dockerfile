# build stage
FROM node:16.15.0-alpine3.15 as build-stage
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app

RUN npm i yalc@1.0.0-pre.53 -g

COPY ./common-front ./common-front
WORKDIR /app/common-front/bin
RUN npm run compile-docker
WORKDIR /app/fox-hunt-organization-front
COPY ./fox-hunt-organization-front ./
RUN npm install
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
RUN apk add --no-cache bash
COPY fox-hunt-organization-front/nginx/nginx-entrypoint.sh /nginx-entrypoint.sh
COPY --from=build-stage /app/fox-hunt-organization-front/build /usr/share/nginx/html
COPY fox-hunt-organization-front/nginx/mime.types /etc/nginx/mime.types
COPY fox-hunt-organization-front/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000

ENTRYPOINT [ "bash", "/nginx-entrypoint.sh" ]
