FROM node:12

WORKDIR /app

# Only re-run install if package files have changed
COPY package*.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Build Nuxt
RUN npm run build

VOLUME /app/db

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0

CMD npm run migrations && npm start
