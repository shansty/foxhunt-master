# build stage
FROM node:16.15.0-alpine3.15 AS development
WORKDIR /app
RUN npm i rimraf -g

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# production stage
FROM node:16.15.0-alpine3.15 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY --from=development /app/dist ./dist
COPY --from=development /app/.env ./
COPY --from=development /app/node_modules ./node_modules
CMD ["node", "dist/main"]