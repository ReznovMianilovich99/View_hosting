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
  
  <template>
    <div class="container">
      <h1 class="title">Gestion des Commandes</h1>
      
      <transition name="fade">
        <form @submit.prevent="addCommande" class="form">
          <div class="form-group">
            <label for="iduser">User ID</label>
            <input v-model="iduser" id="iduser" type="number" placeholder="User ID" required />
          </div>
          <div class="form-group">
            <label for="dateheurecommande">Date et Heure de la Commande</label>
            <input v-model="dateheurecommande" id="dateheurecommande" type="datetime-local" required />
          </div>
          <div class="form-group">
            <label for="totaleprice">Prix Total</label>
            <input v-model.number="totaleprice" id="totaleprice" type="number" placeholder="Prix Total" required />
          </div>
          <div class="checkbox-group">
            <label><input v-model="paiementcheck" type="checkbox" /> Paiement Confirmé</label>
            <label><input v-model="isready" type="checkbox" /> Prête</label>
            <label><input v-model="issend" type="checkbox" /> Envoyée</label>
          </div>
          <div class="form-group">
            <label for="idplats">Plats</label>
            <select v-model="selectedPlats" multiple>
              <option v-for="plat in plats" :key="plat.id" :value="plat.id">
                {{ plat.nom }}
              </option>
            </select>
          </div>
          <button type="submit" class="btn">Ajouter Commande</button>
        </form>
      </transition>
      
      <ul class="commande-list">
        <transition-group name="fade">
          <li v-for="commande in commandes" :key="commande.id" class="commande-item">
            <span>Commande #{{ commande.id }} - User: {{ commande.iduser.nom }} - Total: {{ commande.totaleprice }}€</span>
            <div>
              <button @click="selectCommande(commande)" class="btn edit">Modifier</button>
              <button @click="deleteCommande(commande.id)" class="btn delete">Supprimer</button>
            </div>
          </li>
        </transition-group>
      </ul>
    </div>
  </template>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .title {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .checkbox-group {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }
  input, select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .btn {
    display: inline-block;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease-in-out;
  }
  .btn:hover {
    filter: brightness(1.1);
  }
  .btn.edit {
    background: #ffcc00;
    color: #fff;
  }
  .btn.delete {
    background: #ff4444;
    color: #fff;
  }
  .commande-list {
    list-style: none;
    padding: 0;
  }
  .commande-item {
    background: white;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.3s ease-in-out;
  }
  .commande-item:hover {
    transform: scale(1.02);
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>
  
  