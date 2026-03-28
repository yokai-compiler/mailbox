FROM "node:alpine"

WORKDIR "/usr/app"
COPY . .
RUN npm install

RUN npm run build

CMD ["/bin/node", "/usr/app/dist/server/entry.mjs"]
