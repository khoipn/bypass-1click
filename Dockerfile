FROM mcr.microsoft.com/playwright:v1.56.1-focal

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

CMD ["node", "index.js"]
