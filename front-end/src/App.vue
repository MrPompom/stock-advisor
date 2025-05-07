<!-- front-end/src/App.vue -->
<template>
    <div id="app">
      <nav-bar />
      <div class="container mx-auto py-4 px-4">
        <router-view />
      </div>
    </div>
  </template>
  
  <script>
  import NavBar from '@/components/NavBar.vue';
  
  export default {
    name: 'App',
    components: {
      NavBar
    }
  };
  </script>
  
  <style>
  /* Styles globaux de l'application */
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    background-color: #f5f7fa;
    margin: 0;
    padding: 0;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .btn {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .btn-primary {
    background-color: #4a6cf7;
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #3a5be0;
  }
  
  .btn-secondary {
    background-color: #f0f0f0;
    color: #333;
    border: 1px solid #ddd;
  }
  
  .btn-secondary:hover {
    background-color: #e3e3e3;
  }
  
  .btn-danger {
    background-color: #e53e3e;
    color: white;
    border: none;
  }
  
  .btn-danger:hover {
    background-color: #c53030;
  }
  
  .card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
  }
  
  .form-control {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .form-control:focus {
    outline: none;
    border-color: #4a6cf7;
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }
  
  .text-danger {
    color: #e53e3e;
  }
  
  .mb-4 {
    margin-bottom: 16px;
  }
  
  .d-flex {
    display: flex;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .align-center {
    align-items: center;
  }
  
  .flex-wrap {
    flex-wrap: wrap;
  }
  
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
  
  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #4a6cf7;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .positive {
    color: #2f855a;
  }
  
  .negative {
    color: #e53e3e;
  }
  
  .recommended {
    background-color: #f0fff4;
    border-left: 4px solid #2f855a;
  }
  </style>
  
  