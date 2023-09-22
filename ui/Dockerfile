###################
# SET SSH KEY FOR NPM
###################
FROM node:18-alpine As dependencies

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

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

ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL

ENV NODE_ENV production

RUN npm run build

###################
# PRODUCTION
###################

FROM node:18-buster As production

WORKDIR /usr/src/app

ARG PORT=8080
ENV PORT=$PORT

ENV PORT=8080

COPY --from=build /usr/src/app/build/ /usr/share/nginx/html/
COPY --from=build /usr/src/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE $PORT
CMD ["nginx", "-g", "daemon off;"]