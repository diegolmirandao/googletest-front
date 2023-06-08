FROM node:18 as build
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .

RUN yarn run build

FROM nginx:1.19
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html