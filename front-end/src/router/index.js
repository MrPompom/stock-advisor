// front-end/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import AuthService from '@/services/auth';

// Importer les composants de vue
const Home = () => import('@/views/Home.vue');
const StockList = () => import('@/views/StockList.vue');
const RecommendedStocks = () => import('@/views/RecommendedStocks.vue');
const Admin = () => import('@/views/Admin.vue');
const ThresholdForm = () => import('@/views/ThresholdForm.vue');
const NotFound = () => import('@/views/NotFound.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/stocks',
    name: 'StockList',
    component: StockList
  },
  {
    path: '/recommended',
    name: 'RecommendedStocks',
    component: RecommendedStocks
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/threshold/new',
    name: 'NewThreshold',
    component: ThresholdForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/threshold/:id',
    name: 'EditThreshold',
    component: ThresholdForm,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Guard de navigation pour les routes protégées
router.beforeEach(async (to, from, next) => {
  // Si la route nécessite une authentification
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Si on est déjà sur /admin, laisser passer pour afficher le formulaire de PIN
    if (to.path === '/admin' && !AuthService.isAuthenticated()) {
      next();
      return;
    }
    
    // Pour les autres routes admin, vérifier l'authentification
    if (!AuthService.isAuthenticated()) {
      // Rediriger vers /admin pour se connecter
      next({
        path: '/admin',
        query: { redirect: to.fullPath }
      });
    } else {
      // Vérifier la validité du token côté serveur (optionnel pour éviter trop de requêtes)
      try {
        const isValid = await AuthService.verifyToken();
        if (isValid) {
          next();
        } else {
          AuthService.logout();
          next({
            path: '/admin',
            query: { redirect: to.fullPath }
          });
        }
      } catch (error) {
        // En cas d'erreur, on laisse passer et on gère dans le composant
        next();
      }
    }
  } else {
    next();
  }
});

export default router;