FROM node:18-alpine

# Build cache buster - set BUILD_DATE during deploy to force fresh image
ARG BUILD_DATE
LABEL build_date=$BUILD_DATE

WORKDIR /app

COPY package*.json ./

# Install ALL dependencies for build (including devDependencies for nest CLI)
RUN npm install

COPY . .

# Ensure TypeScript is compiled into dist
RUN npm run build

# Remove devDependencies after build to reduce image size
RUN npm prune --production

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
