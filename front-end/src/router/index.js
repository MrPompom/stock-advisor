// front-end/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

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
    component: Admin
  },
  {
    path: '/admin/threshold/new',
    name: 'NewThreshold',
    component: ThresholdForm
  },
  {
    path: '/admin/threshold/:id',
    name: 'EditThreshold',
    component: ThresholdForm,
    props: true
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

export default router;