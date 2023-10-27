# Use the official Node.js image as the base  
FROM node:18 

# Set the working directory inside the container  
WORKDIR /

# Copy package.json and package-lock.json to the container  
COPY . .  

WORKDIR /nextjs/
# Install dependencies  
RUN npm install

# Copy the app source code to the container  

# Build the Next.js app  
RUN npm run build  

# Expose the port the app will run on  
EXPOSE 3000  

WORKDIR /supabase/docker/

RUN docker compose up -d

# Start the app  
CMD ["npm", "start"]  