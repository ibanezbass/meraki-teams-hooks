FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm install -g pm2

EXPOSE 8080

ENV REDIS_URL=redis://redis_db:6379

CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]

