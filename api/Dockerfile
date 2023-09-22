###################
# PREPARE DEPENDENCIES
###################
FROM node:18-alpine As dependencies

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

###################
# BUILD FOR DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --from=dependencies /usr/src/app/node_modules ./node_modules

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --from=dependencies /usr/src/app/node_modules ./node_modules

COPY  . .

ENV NODE_ENV production

RUN npm run build

###################
# PRODUCTION
###################

FROM node:18-buster As production

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=8080
ENV TZ=UTC

COPY --from=build /usr/src/app/dist ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/db.crt ./db.crt

CMD [ "node", "main.js" ]