FROM node:16.17-alpine as build

WORKDIR /usr/src/app/

COPY package*.json ./

RUN npm install

COPY ./ ./

RUN npm run build

# Host the webiste
FROM nginx:stable-alpine as production

ENV NODE_ENV=production

COPY --from=build /usr/src/app/build/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]