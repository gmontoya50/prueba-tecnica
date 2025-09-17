FROM node:20-alpine

WORKDIR /app

COPY package*.json serverless.yml ./
RUN npm install

COPY . .

EXPOSE 4000 4002 4569 8000

CMD ["npm", "run", "offline", "--", "--stage", "local", "--httpPort", "4000", "--lambdaPort", "4002", "--host", "0.0.0.0"]
