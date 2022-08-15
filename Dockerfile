FROM node:16-slim

WORKDIR /var/www/app

# OS TOOLS
RUN apt-get update

COPY . .

RUN apt-get install -y git

RUN npm ci --quiet
RUN npm run build

EXPOSE 3001

## Default command
CMD [ "npm", "run", "start" ]
