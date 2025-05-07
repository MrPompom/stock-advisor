<!-- front-end/src/views/Admin.vue -->
<template>
  <div class="admin">
    <!-- Écran de blocage par code PIN -->
    <div v-if="!isPinVerified" class="pin-overlay">
      <div class="pin-container">
        <h2>Accès Restreint</h2>
        <p>Veuillez saisir le code PIN pour accéder à l'administration</p>
        
        <div class="pin-input-container">
          <input 
            type="password" 
            v-model="enteredPin"
            placeholder="Code PIN" 
            class="pin-input"
            maxlength="6"
            @keyup.enter="verifyPin"
          />
        </div>
        
        <div v-if="pinError" class="pin-error">
          {{ pinError }}
        </div>
        
        <button @click="verifyPin" class="btn btn-primary">Valider</button>
      </div>
    </div>

    <!-- Contenu normal de la page admin (visible uniquement si le PIN est validé) -->
    <template v-else>
      <h1 class="page-title">Administration</h1>
      <!-- Intégrer les contrôles administrateur -->
      <admin-controls />
      
      <div class="admin-header">
        <p class="admin-desc">Gérez les seuils de prix pour vos actions suivies</p>
        <router-link to="/admin/threshold/new" class="btn btn-primary">
          Ajouter une nouvelle action
        </router-link>
      </div>
      
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
      </div>
      
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="fetchThresholds" class="btn btn-primary">Réessayer</button>
      </div>
      
      <div v-else>
        <div v-if="thresholds.length === 0" class="no-data">
          <p>Aucune action configurée.</p>
          <p>Ajoutez des actions pour commencer à recevoir des recommandations.</p>
          <router-link to="/admin/threshold/new" class="btn btn-primary">
            Ajouter une nouvelle action
          </router-link>
        </div>
        
        <div v-else>
          <!-- Section des seuils actifs -->
          <h2 class="section-title">Seuils Actifs</h2>
          <div v-if="activeThresholds.length > 0" class="thresholds-grid">
            <threshold-item 
              v-for="threshold in activeThresholds" 
              :key="threshold._id" 
              :threshold="threshold"
              @delete="deleteThreshold"
              @toggle-active="toggleThresholdActive"
            />
          </div>
          <div v-else class="empty-section">
            <p>Aucun seuil actif trouvé</p>
          </div>
          
          <!-- Séparateur et titre pour les seuils inactifs -->
          <div class="inactive-separator">
            <h2 class="section-title">Seuils Inactifs</h2>
          </div>
          
          <!-- Section des seuils inactifs -->
          <div v-if="inactiveThresholds.length > 0" class="thresholds-grid">
            <threshold-item 
              v-for="threshold in inactiveThresholds" 
              :key="threshold._id" 
              :threshold="threshold"
              @delete="deleteThreshold"
              @toggle-active="toggleThresholdActive"
            />
          </div>
          <div v-else class="empty-section">
            <p>Aucun seuil inactif trouvé</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ThresholdItem from '@/components/ThresholdItem.vue';
import AdminControls from '@/components/AdminControls.vue';

export default {
  name: 'Admin',
  components: {
    ThresholdItem,
    AdminControls
  },
  data() {
    return {
      // Système de code PIN
      isPinVerified: false,
      enteredPin: '',
      correctPin: '1702',
      pinError: '',
      storageKey: 'admin_pin_verified'
    };
  },
  computed: {
    ...mapGetters(['allThresholds', 'isLoading', 'error']),
    thresholds() {
      return this.allThresholds;
    },
    // Filtrer les seuils actifs
    activeThresholds() {
      return this.thresholds.filter(threshold => threshold.isActive);
    },
    // Filtrer les seuils inactifs
    inactiveThresholds() {
      return this.thresholds.filter(threshold => !threshold.isActive);
    }
  },
  created() {
    // Vérifier si l'utilisateur a déjà été authentifié
    const isPinVerified = localStorage.getItem(this.storageKey) === 'true';
    
    if (isPinVerified) {
      this.isPinVerified = true;
      this.fetchThresholds();
    }
  },
  methods: {
    ...mapActions(['fetchThresholds', 'deleteThreshold']),
    // Méthode pour vérifier le code PIN
    verifyPin() {
    if (this.enteredPin === this.correctPin) {
      this.isPinVerified = true;
      this.pinError = '';
      
      // Sauvegarder l'authentification dans le stockage local
      localStorage.setItem(this.storageKey, 'true');
      
      // Recharger la page pour mettre à jour la barre de navigation
      window.location.reload();
      
      // Le code ci-dessous ne sera pas exécuté à cause du rechargement,
      // mais nous le gardons au cas où le rechargement échouerait
      this.fetchThresholds();
    } else {
      this.pinError = 'Code PIN incorrect. Veuillez réessayer.';
      this.enteredPin = '';
    }
  },
    // Méthode pour basculer l'état actif/inactif d'un seuil
    toggleThresholdActive(data) {
      // Supposons que vous avez une action dans votre store pour cela
      this.$store.dispatch('toggleThresholdActive', data);
    }
  }
};
</script>

<style scoped>
.admin {
  padding: 20px 0;
  position: relative;
  min-height: 100vh;
}

/* Styles pour l'écran de code PIN */
.pin-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.pin-container {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.pin-container h2 {
  margin-top: 0;
  color: #2d3748;
}

.pin-input-container {
  margin: 25px 0;
}

.pin-input {
  font-size: 1.2rem;
  letter-spacing: 0.2em;
  text-align: center;
  padding: 10px 15px;
  width: 100%;
  max-width: 200px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
}

.pin-error {
  color: #e53e3e;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

/* Styles existants */
.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #2d3748;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.admin-desc {
  color: #718096;
  margin: 0;
}

.section-title {
  margin: 20px 0 15px 0;
  font-size: 1.5rem;
  color: #2d3748;
}

.thresholds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.inactive-separator {
  margin: 40px 0 15px 0;
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
}

.empty-section {
  background-color: #f7fafc;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: #718096;
  margin-bottom: 30px;
}

.error-message {
  padding: 20px;
  background-color: #fff5f5;
  border-radius: 8px;
  color: #c53030;
  margin-bottom: 20px;
  text-align: center;
}

.no-data {
  padding: 40px;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 8px;
  color: #718096;
}
</style>