FROM node:20-bullseye

WORKDIR /app

# Copy only package files first (for layer caching)
COPY package*.json ./

# Install dependencies (this layer will be cached if package.json doesn't change)
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Metro bundler
EXPOSE 8081 19000 19001 19002

CMD ["npx", "expo", "start", "--host", "0.0.0.0"]
