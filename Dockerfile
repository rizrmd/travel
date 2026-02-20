FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci --include=dev

COPY . .
RUN npm run build
RUN cd frontend && npm run build
RUN mkdir -p dist/frontend/.next \
    && cp -R frontend/.next/standalone/. dist/frontend/ \
    && cp -R frontend/.next/static dist/frontend/.next/static \
    && if [ -d frontend/public ]; then cp -R frontend/public dist/frontend/public; fi
RUN npm prune --omit=dev

FROM node:20-alpine AS runner

WORKDIR /app


COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package*.json ./

ENV NODE_ENV=production
USER node
EXPOSE 3001

CMD ["npm", "run", "start:prod"]
