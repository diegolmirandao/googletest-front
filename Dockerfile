FROM node:18-alpine as build
WORKDIR /app
COPY . /app
RUN yarn install

RUN yarn run build

FROM nginx:1.19
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html