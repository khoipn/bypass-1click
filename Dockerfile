FROM node:18-bullseye

# Install dependencies for Chromium
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libxshmfence1 \
    wget \
    --no-install-recommends

# Install Playwright browsers
RUN npm i -g playwright && \
    playwright install --with-deps chromium

WORKDIR /app
COPY package.json ./
RUN npm install

COPY . .

CMD ["node", "index.js"]
