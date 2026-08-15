ARG PLATFORM=linux/amd64

FROM --platform=${PLATFORM} node:lts-alpine
ARG START_MODE=start:noenv
ENV START_MODE=${START_MODE}
WORKDIR /api
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD npm run ${START_MODE}