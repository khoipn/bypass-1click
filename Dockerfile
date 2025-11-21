FROM mcr.microsoft.com/playwright:v1.56.1

WORKDIR /app

COPY package.json ./
RUN npm install


COPY . .

CMD ["node", "index.js"]
