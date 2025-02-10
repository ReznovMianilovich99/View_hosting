const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: "all", // Autorise toutes les connexions
    host: "0.0.0.0", // Écoute sur toutes les interfaces
    port: 8080, // Modifie si nécessaire
    client: {
      webSocketURL: "auto://0.0.0.0:0/ws"
    }
  }
});