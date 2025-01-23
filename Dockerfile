# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Copy the .env and .env.development files
COPY .env* ./

# Generate prisma types
RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN npm run build

EXPOSE ${PORT}

# Define the environment variable for the port (default is 3000)
ENV PORT 3000

# Start the server using the production build
CMD ["npm", "run", "start:prod"]
