FROM node:20-alpine
WORKDIR /app

# Optimize caching by installing dependencies first
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
