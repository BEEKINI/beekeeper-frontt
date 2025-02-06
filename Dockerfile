FROM node:latest as build

WORKDIR /app

COPY package*.json ./

RUN yarn install

RUN yarn global add @angular/cli

# RUN npm install -g @angular/cli

COPY . .

RUN ng build

FROM nginx:latest 

COPY --from=build /app/dist/bee-keeper/browser /usr/share/nginx/html

EXPOSE 80