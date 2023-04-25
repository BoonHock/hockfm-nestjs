FROM node:18-alpine3.16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]