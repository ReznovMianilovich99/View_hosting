<template>
    <div>
      <h1>Gestion des Ingrédients</h1>
  
      <!-- Formulaire pour ajouter un ingrédient -->
      <form @submit.prevent="addIngredient">
        <input v-model="nom" placeholder="Nom de l'ingrédient" required />
        <input v-model.number="stock" type="number" placeholder="Stock" required />
        <input v-model="imagelink" placeholder="Lien de l'image" />
        <button type="submit">Ajouter</button>
      </form>
  
      <!-- Liste des ingrédients -->
      <ul>
        <li v-for="ingredient in ingredients" :key="ingredient.id">
          {{ ingredient.nom }} - Stock: {{ ingredient.stock }}
          <button @click="selectIngredient(ingredient)">Modifier</button>
          <button @click="deleteIngredient(ingredient.id)">Supprimer</button>
        </li>
      </ul>
  
      <!-- Formulaire de modification -->
      <div v-if="selectedIngredient">
        <h2>Modifier Ingrédient</h2>
        <input v-model="selectedIngredient.nom" />
        <input v-model.number="selectedIngredient.stock" type="number" />
        <input v-model="selectedIngredient.imagelink" />
        <button @click="updateIngredient">Mettre à jour</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        ingredients: [],
        nom: "",
        stock: 0,
        imagelink: "",
        selectedIngredient: null,
      };
    },
    methods: {
      async fetchIngredients() {
        try {
          const response = await axios.get(
            "https://symfony-cooking-production.up.railway.app/apiingredient/all"
          );
          this.ingredients = response.data;
        } catch (error) {
          console.error("Erreur lors du chargement des ingrédients", error);
        }
      },
  
      async addIngredient() {
        try {
          const ingredientData = {
            nom: this.nom,
            stock: this.stock,
            imagelink: this.imagelink,
          };
  
          await axios.post(
            "https://symfony-cooking-production.up.railway.app/apiingredient/new",
            ingredientData,
            { headers: { "Content-Type": "application/json" } }
          );
  
          this.nom = "";
          this.stock = 0;
          this.imagelink = "";
          this.fetchIngredients();
        } catch (error) {
          console.error("Erreur lors de l'ajout", error);
        }
      },
  
      selectIngredient(ingredient) {
        this.selectedIngredient = { ...ingredient };
      },
  
      async updateIngredient() {
        if (!this.selectedIngredient) return;
        console.log("Données envoyées :", this.selectedIngredient);
        try {
          await axios.put(
            `https://symfony-cooking-production.up.railway.app/apiingredient/${this.selectedIngredient.id}/edit`,
            this.selectedIngredient,
            { headers: { "Content-Type": "application/json" } }
          );
  
          this.selectedIngredient = null;
          this.fetchIngredients();
        } catch (error) 
        {
          console.log(error.response.data);
          console.error("Erreur lors de la mise à jour", error);
        }
      },
  
      async deleteIngredient(id) {
        try {
          await axios.delete(
            `https://symfony-cooking-production.up.railway.app/apiingredient/delete/${id}`
          );
          this.fetchIngredients();
        } catch (error) {
          console.error("Erreur lors de la suppression", error);
        }
      },
    },
    mounted() {
      this.fetchIngredients();
    },
  };
  </script>
  