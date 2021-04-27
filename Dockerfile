FROM zenika/alpine-chrome:with-node as base

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
WORKDIR /usr/src/app
COPY package.json tsconfig.json ./
COPY . .
USER root
RUN npm install
RUN npm run build

FROM base
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
WORKDIR /usr/src/app
COPY --chown=chrome package.json package-lock.json ./
RUN npm install
COPY --chown=chrome . ./
ENTRYPOINT ["tini", "--"]
COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "./dist/index.js"]
