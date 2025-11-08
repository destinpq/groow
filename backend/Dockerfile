FROM node:18-alpine

# Build cache buster - set BUILD_DATE during deploy to force fresh image
ARG BUILD_DATE
LABEL build_date=$BUILD_DATE

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

# Ensure TypeScript is compiled into dist
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
