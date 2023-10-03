# Build stage
FROM node:18-alpine as build

# set working directory
WORKDIR /usr/src/app

# copy package.json and package-lock.json
COPY package*.json .

# install dependencies
RUN npm ci

# copy source code
COPY . .

# expose port 8080
EXPOSE 4000

# start app
CMD ["npm", "run", "dev"]
