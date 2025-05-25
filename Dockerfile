# Use official Node LTS image
FROM node:18
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose port
EXPOSE 3000

# Run the application
CMD ["/wait-for-it.sh", "kafka:9092", "--", "npm", "start"]
