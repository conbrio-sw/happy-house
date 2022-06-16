FROM nginx:stable-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build


FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /user/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]