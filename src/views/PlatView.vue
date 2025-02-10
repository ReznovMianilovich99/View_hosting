<template>
    <div>
      <h1>Liste des Plats</h1>
      <ul>
        <li v-for="plat in plats" :key="plat.id">
          {{ plat.nom }} - {{ plat.prix }}€ - {{ plat.cookingtime }} min
          <button @click="selectPlat(plat)">Modifier</button>
          <button @click="deletePlat(plat.id)">Supprimer</button>
        </li>
      </ul>
  
      <div v-if="selectedPlat">
        <h2>Modifier Plat</h2>
        <input v-model="selectedPlat.nom" placeholder="Nom" />
        <input v-model="selectedPlat.prix" type="number" placeholder="Prix" />
        <input v-model.number="selectedPlat.cookingtime" type="number" placeholder="Temps de cuisson" />
        <input v-model="selectedPlat.linkimage" placeholder="Lien de l'image" />
        <button @click="updatePlat">Mettre à jour</button>
      </div>
  
      <h2>Ajouter un Plat</h2>
      <input v-model="newPlat.nom" placeholder="Nom" />
      <input v-model="newPlat.prix" type="number" placeholder="Prix" />
      <input v-model.number="newPlat.cookingtime" type="number" placeholder="Temps de cuisson" />
      <input v-model="newPlat.linkimage" placeholder="Lien de l'image" />
      <button @click="addPlat">Ajouter</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        plats: [],
        newPlat: { nom: '', prix: "", cookingtime: 0, linkimage: '' },
        selectedPlat: null,
      };
    },
    methods: {
      async fetchPlats() {
        const response = await axios.get('https://symfony-cooking-production.up.railway.app/apiplat/all');
        this.plats = response.data;
      },
      async addPlat() {
        await axios.post('https://symfony-cooking-production.up.railway.app/apiplat/new', this.newPlat);
        this.newPlat = { nom: '', prix: "", cookingtime: 0, linkimage: '' };
        this.fetchPlats();
      },
      async updatePlat() {
        await axios.put(`https://symfony-cooking-production.up.railway.app/apiplat/${this.selectedPlat.id}/edit`, this.selectedPlat);
        this.selectedPlat = null;
        this.fetchPlats();
      },
      async deletePlat(id) {
        await axios.delete(`https://symfony-cooking-production.up.railway.app/apiplat/delete/${id}`);
        this.fetchPlats();
      },
      selectPlat(plat) {
        this.selectedPlat = { ...plat };
      },
    },
    mounted() {
      this.fetchPlats();
    },
  };
  </script>
  