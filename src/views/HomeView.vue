<template>
  <div class="container">
    <h1>Gestion des Utilisateurs</h1>
    <form @submit.prevent="addUser" class="form">
      <input v-model="newUser.email" placeholder="Email" required />
      <input v-model="newUser.password" type="password" placeholder="Mot de passe" required />
      <button type="submit">Ajouter</button>
    </form>
    <ul class="user-list">
      <li v-for="user in users" :key="user.id" class="user-item">
        {{ user.email }}
        <button @click="selectUser(user)">Modifier</button>
        <button @click="deleteUser(user.id)">Supprimer</button>
      </li>
    </ul>
    <div v-if="selectedUser" class="edit-form">
      <h2>Modifier Utilisateur</h2>
      <input v-model="selectedUser.email" />
      <input v-model="selectedUser.password" type="password" />
      <button @click="updateUser">Mettre à jour</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const users = ref([]);
    const newUser = ref({ email: '', password: '', roles: ['ROLE_USER']});
    const selectedUser = ref(null);

    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://symfony-cooking-production.up.railway.app/apiuser/all');
        users.value = response.data;
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs', error);
      }
    };

    const addUser = async () => {
      try {
        await axios.post('https://symfony-cooking-production.up.railway.app/apiuser/new', newUser.value);
        newUser.value = { email: '', password: ''};
        fetchUsers();
      } catch (error) {
        console.error('Erreur lors de l ajout', error);
      }
    };

    const selectUser = (user) => {
      selectedUser.value = { ...user };
    };

    const updateUser = async () => {
      if (!selectedUser.value) return;
      try {
        await axios.put(`https://symfony-cooking-production.up.railway.app/apiuser/${selectedUser.value.id}/edit`, selectedUser.value);
        selectedUser.value = null;
        fetchUsers();
      } catch (error) {
        console.error('Erreur lors de la mise à jour', error);
      }
    };

    const deleteUser = async (id) => {
      try {
        await axios.delete(`https://symfony-cooking-production.up.railway.app/apiuser/delete/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Erreur lors de la suppression', error);
      }
    };

    onMounted(fetchUsers);

    return {
      users,
      newUser,
      selectedUser,
      fetchUsers,
      addUser,
      selectUser,
      updateUser,
      deleteUser
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  text-align: center;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.form {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: slideIn 0.5s ease-in-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

.user-list {
  list-style: none;
  padding: 0;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  transition: background 0.3s;
}

.user-item:hover {
  background: #e3e3e3;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

button:hover {
  background: #0056b3;
}

.edit-form {
  margin-top: 20px;
  animation: fadeIn 0.5s ease-in-out;
}
</style>
