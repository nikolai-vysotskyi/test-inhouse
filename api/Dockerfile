FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm install
RUN npm run build
CMD ["npm", "start"]
