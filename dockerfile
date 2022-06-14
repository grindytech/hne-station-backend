FROM  node:14-alpine
WORKDIR /app
COPY . /app
RUN npm install --production
RUN npm run build
CMD ["npm", "run", "start:prod" ]