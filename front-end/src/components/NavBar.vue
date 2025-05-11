<!-- front-end/src/components/NavBar.vue -->
<template>
  <nav class="navbar">
    <div class="container mx-auto">
      <div class="navbar-content">
        <div class="navbar-brand">
          <router-link to="/" class="navbar-logo" @click="closeMobileMenu">Stock Advisor</router-link>
        </div>
        
        <!-- Bouton hamburger pour mobile -->
        <button 
          class="mobile-menu-button" 
          @click="toggleMobileMenu"
          :class="{ 'active': isMobileMenuOpen }"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
        
        <!-- Menu de navigation -->
        <div class="navbar-menu" :class="{ 'mobile-open': isMobileMenuOpen }">
          <router-link 
            to="/recommended" 
            class="navbar-item"
            @click="closeMobileMenu"
          >
            Actions Recommandées
          </router-link>
          <router-link 
            to="/stocks" 
            class="navbar-item"
            @click="closeMobileMenu"
          >
            Toutes les Actions
          </router-link>
          <router-link 
            v-if="isAdminVerified" 
            to="/admin" 
            class="navbar-item"
            @click="closeMobileMenu"
          >
            Administration
          </router-link>
          <button 
            v-if="isAdminVerified" 
            @click="logout" 
            class="navbar-item navbar-logout"
          >
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
      isAdminVerified: false,
      isMobileMenuOpen: false
    };
  },
  created() {
    // Vérifier l'état d'authentification lors de la création du composant
    this.checkAdminStatus();
    
    // Ajouter un écouteur pour détecter les changements de localStorage (pour les mises à jour en temps réel)
    window.addEventListener('storage', this.handleStorageChange);
    
    // Ajouter un écouteur personnalisé pour les changements d'authentification
    window.addEventListener('auth-changed', this.checkAdminStatus);
    
    // Fermer le menu mobile lors du redimensionnement
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    // Nettoyer les écouteurs lors de la destruction du composant
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('auth-changed', this.checkAdminStatus);
    window.removeEventListener('resize', this.handleResize);
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
      this.closeMobileMenu();
      this.$router.push('/');
      
      // Émettre un événement personnalisé pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('auth-changed'));
    },
    
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
    
    handleResize() {
      // Fermer le menu mobile si l'écran devient plus large
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
      }
    }
  }
};
</script>

<style scoped>
.navbar {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 15px 0;
  position: relative;
}

.container {
  padding: 0 20px;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.navbar-brand {
  font-size: 24px;
  font-weight: 700;
  z-index: 1001;
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
  transition: color 0.3s;
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

/* Bouton hamburger pour mobile */
.mobile-menu-button {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger-line {
  width: 25px;
  height: 3px;
  background-color: #4a5568;
  margin: 3px 0;
  transition: all 0.3s;
  border-radius: 2px;
}

/* Animation du hamburger */
.mobile-menu-button.active .hamburger-line:nth-child(1) {
  transform: rotate(-45deg) translate(-5px, 6px);
}

.mobile-menu-button.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-button.active .hamburger-line:nth-child(3) {
  transform: rotate(45deg) translate(-5px, -6px);
}

/* Media queries pour le responsive */
@media (max-width: 768px) {
  .navbar {
    padding: 10px 0;
  }
  
  .navbar-content {
    position: relative;
  }
  
  .mobile-menu-button {
    display: flex;
  }
  
  .navbar-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease-in-out;
    z-index: 1000;
  }
  
  .navbar-menu.mobile-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .navbar-item {
    padding: 12px 0;
    text-align: center;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .navbar-item:last-child {
    border-bottom: none;
  }
  
  .navbar-item::after {
    display: none;
  }
  
  .navbar-item:hover {
    color: #4a6cf7;
  }
  
  .navbar-logout {
    width: 100%;
    padding: 12px 0;
  }
}

@media (max-width: 480px) {
  .navbar-brand {
    font-size: 20px;
  }
  
  .container {
    padding: 0 15px;
  }
}
</style>