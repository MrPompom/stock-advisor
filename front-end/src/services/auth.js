// front-end/src/services/auth.js
import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

class AuthService {
  // Vérifier le code PIN et obtenir un token
  async verifyPin(pin) {
    try {
      const response = await axios.post(`${API_URL}/auth/pin`, { pin });
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('tokenExpiration', Date.now() + 24 * 60 * 60 * 1000);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de connexion');
    }
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated() {
    const token = localStorage.getItem('adminToken');
    const expiration = localStorage.getItem('tokenExpiration');
    
    if (!token || !expiration) return false;
    
    // Vérifier si le token n'a pas expiré
    if (Date.now() > parseInt(expiration)) {
      this.logout();
      return false;
    }
    
    return true;
  }

  // Obtenir le token
  getToken() {
    return localStorage.getItem('adminToken');
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('tokenExpiration');
  }

  // Vérifier la validité du token côté serveur
  async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();