FROM node:latest

RUN apt-get update && apt-get install -y apache2 && apt-get clean

WORKDIR /app

# COPY hexus-site/package*.json ./
# COPY hexus-site/tsconfig*.json ./
# COPY hexus-site/src ./src
# COPY hexus-site/scripts ./scripts
# COPY hexus-site/public ./public
COPY hexus-site/ ./

RUN npm install

RUN npm run build

RUN cp -r dist/* /var/www/html/

EXPOSE 80
EXPOSE 443

CMD ["apachectl", "-D", "FOREGROUND"]