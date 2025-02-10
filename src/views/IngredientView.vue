<template>
  <div class="container">
    <h1>Gestion des Recettes</h1>
    <form @submit.prevent="addRecette" class="form">
      <select v-model="newRecette.idplat" required>
        <option v-for="plat in plats" :key="plat.id" :value="plat.id">{{ plat.nom }}</option>
      </select>
      <select v-model="newRecette.idingredients" multiple required>
        <option v-for="ingredient in ingredients" :key="ingredient.id" :value="ingredient.id">{{ ingredient.nom }}</option>
      </select>
      <button type="submit">Ajouter</button>
    </form>
    <ul class="recette-list">
  <li v-for="recette in recettes" :key="recette.id" class="recette-item">
    Plat: {{ recette.idplat ? recette.idplat.nomplat : 'Non défini' }} - 
    Ingrédients: {{ recette.idingredient ? recette.idingredient.map(i => i.nomIngredient).join(', ') : 'Aucun' }}
    <button @click="selectRecette(recette)">Modifier</button>
    <button @click="deleteRecette(recette.id)">Supprimer</button>
  </li>
</ul>

    <div v-if="selectedRecette" class="edit-form">
      <h2>Modifier Recette</h2>
      <select v-model="selectedRecette.idplat" required>
        <option v-for="plat in plats" :key="plat.id" :value="plat.id">{{ plat.nom }}</option>
      </select>
      <select v-model="selectedRecette.idingredients" multiple required>
        <option v-for="ingredient in ingredients" :key="ingredient.id" :value="ingredient.id">{{ ingredient.nom }}</option>
      </select>
      <button @click="updateRecette">Mettre à jour</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const recettes = ref([]);
    const plats = ref([]);
    const ingredients = ref([]);
    const newRecette = ref({ idplat: '', idingredients: [] });
    const selectedRecette = ref(null);

    const fetchRecettes = async () => {
      try {
        const response = await axios.get('https://symfony-cooking-production.up.railway.app/apirecette/all');
        recettes.value = response.data;
      } catch (error) {
        console.error('Erreur lors du chargement des recettes', error);
      }
    };

    const fetchPlats = async () => {
      try {
        const response = await axios.get('https://symfony-cooking-production.up.railway.app/apiplat/all');
        plats.value = response.data;
      } catch (error) {
        console.error('Erreur lors du chargement des plats', error);
      }
    };

    const fetchIngredients = async () => {
      try {
        const response = await axios.get('https://symfony-cooking-production.up.railway.app/apiingredient/all');
        ingredients.value = response.data;
      } catch (error) 
      {
        console.error('Erreur lors du chargement des ingrédients', error);
      }
    };

    const addRecette = async () => {
  try {
    const payload = {
      idplat: { id: newRecette.value.idplat }, // Encapsuler idplat dans un objet
      idingredient: newRecette.value.idingredients.map(id => ({ id })) // Transformer chaque ID en objet
    };
    await axios.post('https://symfony-cooking-production.up.railway.app/apirecette/new', payload);
    newRecette.value = { idplat: '', idingredients: [] };
    fetchRecettes();
  } catch (error) {
    console.error('Erreur lors de l\'ajout', error);
  }
};

const selectRecette = (recette) => {
  selectedRecette.value = {
    ...recette,
    idplat: recette.idplat.idplat, // Assurer que c'est bien l'ID
    idingredients: recette.idingredient ? recette.idingredient.map(i => i.idIngredient) : [] // Convertir en tableau d'IDs
  };
};

const updateRecette = async () => {
  if (!selectedRecette.value) return;

  // Construire le bon format de requête
  const updatedRecette = {
    idplat: { id: selectedRecette.value.idplat }, // Objet avec ID
    idingredient: selectedRecette.value.idingredients.map(id => ({ id })) // Tableau d'objets { id: ... }
  };

  try {
    await axios.put(`https://symfony-cooking-production.up.railway.app/apirecette/${selectedRecette.value.id}/edit`, updatedRecette);
    selectedRecette.value = null;
    fetchRecettes();
  } catch (error) {
    console.error("Erreur lors de la mise à jour", error);
  }
};

    const deleteRecette = async (id) => {
      try {
        await axios.delete(`https://symfony-cooking-production.up.railway.app/apirecette/delete/${id}`);
        fetchRecettes();
      } catch (error) {
        console.error('Erreur lors de la suppression', error);
      }
    };

    onMounted(() => {
      fetchRecettes();
      fetchPlats();
      fetchIngredients();
    });

    return {
      recettes,
      plats,
      ingredients,
      newRecette,
      selectedRecette,
      fetchRecettes,
      addRecette,
      selectRecette,
      updateRecette,
      deleteRecette
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  text-align: center;
}
.form {
  margin-bottom: 20px;
}
.recette-list {
  list-style: none;
  padding: 0;
}
.recette-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.edit-form {
  margin-top: 20px;
}
</style>
