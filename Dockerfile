FROM node:12

RUN mkdir /home/nodeWorkspace

WORKDIR /home/nodeWorkspace/

COPY package*.json ./

RUN npm install -g nodemon

RUN npm install

COPY . .

EXPOSE 3000:3000

CMD ["npm", "start"]