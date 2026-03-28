FROM "node:alpine"

WORKDIR "/usr/app"
COPY . .
RUN npm install && npm run build

CMD ["node", "/usr/app/dist/server/entry.mjs"]
