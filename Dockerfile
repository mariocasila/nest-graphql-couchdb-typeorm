FROM node:18-alpine
RUN mkdir /srv/content_service
WORKDIR /srv/content_service
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 8044
RUN npm run build
ENV TRUST_PROXY=true
ENV START_OCR_SERVICE=true
ENV API_PORT=8044
ENV COUCHDB_URL=http://couchdb:5984  
ENV KAFKA_HOST="127.0.0.1"
ENV KAFKA_PORT=9092 
ENV API_CORS="*" 
ENV COUCH_DB_URL=http://USERNAME:PASSWORD@couchdb:5984
ENV MYSQL_DB_URL=mysql://admin:password@mysql:3306/shping_content_db
ENV SHPING_API_URL=https://api.shping.com

CMD ["/bin/sh", "./service.sh"]

