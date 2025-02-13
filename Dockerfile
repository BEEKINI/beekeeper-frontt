# Étape 1 : Build de l'application Angular
FROM node:latest AS build

WORKDIR /app

# Activer Corepack et préparer Yarn stable
RUN corepack enable && corepack prepare yarn@stable --activate

# Copier les fichiers de dépendances
COPY package.json yarn.lock ./

# 🔹 Solution : Forcer Yarn à utiliser node_modules
RUN yarn config set nodeLinker node-modules

# Installer les dépendances
RUN yarn install --frozen-lockfile

# Copier le reste du projet
COPY . .

# 🔹 Compiler Angular en passant explicitement par `yarn run`
RUN yarn run ng build --configuration=production

# Étape 2 : Serveur Nginx pour servir Angular
FROM nginx:latest 

COPY --from=build /app/dist/bee-keeper/browser /usr/share/nginx/html

EXPOSE 80
