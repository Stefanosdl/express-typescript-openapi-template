FROM node:20-alpine

WORKDIR /app

# Install app dependencies
COPY package*.json /app/

RUN npm install

# For development purposes
RUN npm install -g nodemon

# Bundle app source
COPY . /app/
RUN npm run build:check

EXPOSE 8080

CMD ["npm", "run", "dev"]
