FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exécuter les vérifications lint
RUN npm run lint

# Construire l'application
RUN npm run build

# Exposer le port utilisé par l'application
EXPOSE 8080

# Commande par défaut pour démarrer le serveur
CMD ["npm", "run", "start"]
