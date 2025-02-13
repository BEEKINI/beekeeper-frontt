FROM node:latest AS build

WORKDIR /app

RUN corepack enable && corepack prepare yarn@stable --activate

COPY package.json ./

RUN yarn config set nodeLinker node-modules

RUN yarn install --mode update-lockfile

RUN yarn

COPY . .

RUN yarn run ng build --configuration=production

FROM nginx:latest 

COPY --from=build /app/dist/bee-keeper/browser /usr/share/nginx/html

EXPOSE 80
