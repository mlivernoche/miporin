FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

# Copy application package definition and built output
COPY apps/main/package.json ./package.json
COPY apps/main/build ./build

USER node

EXPOSE 3000

CMD ["node", "build/index.js"]
