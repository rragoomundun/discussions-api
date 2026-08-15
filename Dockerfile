ARG PLATFORM=linux/amd64

FROM --platform=${PLATFORM} node:lts-alpine
WORKDIR /api
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD node server.js