<template>
    <div>
      <h1>Gestion des Commandes</h1>
  
      <!-- Formulaire pour ajouter une commande -->
      <form @submit.prevent="addCommande">
        <div>
          <label for="iduser">User ID</label>
          <input v-model="iduser" id="iduser" type="number" placeholder="User ID" required />
        </div>
        <div>
          <label for="dateheurecommande">Date et Heure de la Commande</label>
          <input v-model="dateheurecommande" id="dateheurecommande" type="datetime-local" required />
        </div>
        <div>
          <label for="totaleprice">Prix Total</label>
          <input v-model.number="totaleprice" id="totaleprice" type="number" placeholder="Prix Total" required />
        </div>
        <div>
          <label for="paiementcheck">Paiement Confirmé</label>
          <input v-model="paiementcheck" id="paiementcheck" type="checkbox" />
        </div>
        <div>
          <label for="isready">Prête</label>
          <input v-model="isready" id="isready" type="checkbox" />
        </div>
        <div>
          <label for="issend">Envoyée</label>
          <input v-model="issend" id="issend" type="checkbox" />
        </div>
        <div>
          <label for="idplats">Plats</label>
          <select v-model="selectedPlats" multiple>
            <option v-for="plat in plats" :key="plat.id" :value="plat.id">
              {{ plat.nom }}
            </option>
          </select>
        </div>
        <button type="submit">Ajouter Commande</button>
      </form>
  
      <!-- Liste des commandes -->
      <ul>
        <li v-for="commande in commandes" :key="commande.id">
          Commande #{{ commande.id }} - User: {{ commande.iduser.nom }} - Total: {{ commande.totaleprice }}€
          <button @click="selectCommande(commande)">Modifier</button>
          <button @click="deleteCommande(commande.id)">Supprimer</button>
        </li>
      </ul>
  
      <!-- Formulaire de modification -->
      <div v-if="selectedCommande">
        <h2>Modifier Commande</h2>
        <div>
          <label for="edit-iduser">User ID</label>
          <input v-model="selectedCommande.iduser.id" id="edit-iduser" type="number" />
        </div>
        <div>
          <label for="edit-dateheurecommande">Date et Heure de la Commande</label>
          <input v-model="selectedCommande.dateheurecommande" id="edit-dateheurecommande" type="datetime-local" />
        </div>
        <div>
          <label for="edit-totaleprice">Prix Total</label>
          <input v-model.number="selectedCommande.totaleprice" id="edit-totaleprice" type="number" />
        </div>
        <div>
          <label for="edit-paiementcheck">Paiement Confirmé</label>
          <input v-model="selectedCommande.paiementcheck" id="edit-paiementcheck" type="checkbox" />
        </div>
        <div>
          <label for="edit-isready">Prête</label>
          <input v-model="selectedCommande.isready" id="edit-isready" type="checkbox" />
        </div>
        <div>
          <label for="edit-issend">Envoyée</label>
          <input v-model="selectedCommande.issend" id="edit-issend" type="checkbox" />
        </div>
        <div>
          <label for="edit-idplats">Plats</label>
          <select v-model="selectedCommande.idplats" multiple>
            <option v-for="plat in plats" :key="plat.id" :value="plat.id">
              {{ plat.nom }}
            </option>
          </select>
        </div>
        <button @click="updateCommande">Mettre à jour</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        commandes: [],
        plats: [],
        iduser: "",
        dateheurecommande: "",
        totaleprice: 0,
        paiementcheck: false,
        isready: false,
        issend: false,
        selectedPlats: [],
        selectedCommande: null,
      };
    },
    methods: {
      async fetchCommandes() {
        try {
          const response = await axios.get(
            "https://symfony-cooking-production.up.railway.app/apiCommande/all"
          );
          this.commandes = response.data;
        } catch (error) {
          console.error("Erreur lors du chargement des commandes", error);
        }
      },
  
      async fetchPlats() 
      {
        try {
          const response = await axios.get(
            "https://symfony-cooking-production.up.railway.app/apiplat/all"
          );
          this.plats = response.data;
        } catch (error) {
          console.error("Erreur lors du chargement des plats", error);
        }
      },
  
      async addCommande() {
        try {
          const commandeData = {
            iduser: { id: this.iduser },
            dateheurecommande: this.dateheurecommande,
            totaleprice: this.totaleprice,
            paiementcheck: this.paiementcheck,
            isready: this.isready,
            issend: this.issend,
            idplats: this.selectedPlats.map((platId) => ({ id: platId })),
          };
  
          await axios.post(
            "https://symfony-cooking-production.up.railway.app/apiCommande/new",
            commandeData,
            { headers: { "Content-Type": "application/json" } }
          );
  
          this.resetForm();
          this.fetchCommandes();
        } catch (error) {
          console.error("Erreur lors de l'ajout de la commande", error);
        }
      },
  
      selectCommande(commande) {
        this.selectedCommande = { ...commande };
      },
  
      async updateCommande() {
  if (!this.selectedCommande) return;

  const updatedCommande = {
    ...this.selectedCommande,
    idplats: this.selectedCommande.idplats.map(plat => ({ id: plat }))  // Assurez-vous que idplats soit sous la forme attendue
  };

  console.log("Données envoyées :", JSON.stringify(updatedCommande, null, 2));

  try {
    await axios.put(
      `https://symfony-cooking-production.up.railway.app/apiCommande/${this.selectedCommande.id}/edit`,
      updatedCommande,
      { headers: { "Content-Type": "application/json" }}
    );

    this.selectedCommande = null;
    this.fetchCommandes();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande", error);
  }
},
  
      async deleteCommande(id) 
      {
        try {
          await axios.delete(
            `https://symfony-cooking-production.up.railway.app/apiCommande/delete/${id}`
          );
          this.fetchCommandes();
        } catch (error) {
          console.error("Erreur lors de la suppression de la commande", error);
        }
      },
  
      resetForm() {
        this.iduser = "";
        this.dateheurecommande = "";
        this.totaleprice = 0;
        this.paiementcheck = false;
        this.isready = false;
        this.issend = false;
        this.selectedPlats = [];
      },
    },
    mounted() {
      this.fetchCommandes();
      this.fetchPlats();
    },
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  form div {
    margin-bottom: 10px;
  }
  
  input, select {
    padding: 5px;
    margin-top: 5px;
    width: 100%;
  }
  
  button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  ul li {
    margin: 10px 0;
  }
  
  label {
    font-weight: bold;
  }
  </style>
  