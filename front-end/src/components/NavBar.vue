<!-- front-end/src/components/NavBar.vue -->
<template>
  <nav class="navbar">
    <div class="container mx-auto">
      <div class="navbar-content">
        <div class="navbar-brand">
          <router-link to="/" class="navbar-logo">Stock Advisor</router-link>
        </div>
        <div class="navbar-menu">
          <!--<router-link to="/" class="navbar-item" exact>Accueil</router-link>-->
          <router-link to="/recommended" class="navbar-item">Actions Recommandées</router-link>
          <router-link to="/stocks" class="navbar-item">Toutes les Actions</router-link>
          <router-link v-if="isAdminVerified" to="/admin" class="navbar-item">Administration</router-link>
          <button v-if="isAdminVerified" @click="logout" class="navbar-item navbar-logout">
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import AuthService from '@/services/auth';

export default {
  name: 'NavBar',
  data() {
    return {
      isAdminVerified: false
    };
  },
  created() {
    // Vérifier l'état d'authentification lors de la création du composant
    this.checkAdminStatus();
    
    // Ajouter un écouteur pour détecter les changements de localStorage (pour les mises à jour en temps réel)
    window.addEventListener('storage', this.handleStorageChange);
    
    // Ajouter un écouteur personnalisé pour les changements d'authentification
    window.addEventListener('auth-changed', this.checkAdminStatus);
  },
  beforeUnmount() { // ou beforeDestroy pour Vue 2
    // Nettoyer les écouteurs lors de la destruction du composant
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('auth-changed', this.checkAdminStatus);
  },
  methods: {
    checkAdminStatus() {
      // Vérifier si l'administrateur est authentifié avec le nouveau système
      this.isAdminVerified = AuthService.isAuthenticated();
    },
    
    handleStorageChange(e) {
      // Réagir spécifiquement aux changements du token admin
      if (e.key === 'adminToken' || e.key === 'tokenExpiration') {
        this.checkAdminStatus();
      }
    },
    
    logout() {
      AuthService.logout();
      this.isAdminVerified = false;
      this.$router.push('/');
      
      // Émettre un événement personnalisé pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('auth-changed'));
    }
  }
};
</script>

<style scoped>
.navbar {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 15px 0;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  font-size: 24px;
  font-weight: 700;
}

.navbar-logo {
  color: #4a6cf7;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  gap: 20px;
  align-items: center;
}

.navbar-item {
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 0;
  position: relative;
}

.navbar-logout {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.navbar-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #4a6cf7;
  transition: width 0.3s;
}

.navbar-item:hover::after,
.navbar-item.router-link-active::after {
  width: 100%;
}

.navbar-item.router-link-active {
  color: #4a6cf7;
}
</style>