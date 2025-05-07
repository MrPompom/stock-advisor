<!-- front-end/src/components/NavBar.vue -->
<template>
    <nav class="navbar">
      <div class="container mx-auto">
        <div class="navbar-content">
          <div class="navbar-brand">
            <router-link to="/" class="navbar-logo">Stock Advisor</router-link>
          </div>
          <div class="navbar-menu">
            <router-link to="/" class="navbar-item" exact>Accueil</router-link>
            <router-link to="/stocks" class="navbar-item">Toutes les Actions</router-link>
            <router-link to="/recommended" class="navbar-item">Actions Recommandées</router-link>
            <router-link to="/admin" class="navbar-item">Administration</router-link>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'NavBar'
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
  }
  
  .navbar-item {
    color: #4a5568;
    text-decoration: none;
    font-weight: 500;
    padding: 5px 0;
    position: relative;
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