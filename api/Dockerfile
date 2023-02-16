FROM node:16.10-buster as development

ENV NODE_OPTIONS=--max_old_space_size=2048

WORKDIR /usr/src/app/

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY ./ ./

RUN npm run build

### STAGE 2 - only build dir ###
FROM node:16.10-buster as production

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app/

COPY package*.json ./

RUN npm ci --production

COPY ./config/ ./config/

COPY --from=development /usr/src/app/build/src/ ./src/

CMD ["node","./src/server.js"]