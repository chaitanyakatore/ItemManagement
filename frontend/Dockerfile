# frontend/Dockerfile
FROM node:16

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

# Copy everything
COPY . .

# Build the project
RUN npm run build

# Serve using serve
RUN npm install -g serve
CMD ["serve", "-s", "build"]

EXPOSE 3000
