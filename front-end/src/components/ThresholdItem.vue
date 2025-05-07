<!-- front-end/src/components/ThresholdItem.vue -->
<template>
    <div class="threshold-item card">
      <div class="threshold-header">
        <h3 class="threshold-symbol">{{ threshold.symbol }}</h3>
        <p class="threshold-name">{{ threshold.name }}</p>
      </div>
      <div class="threshold-price">
        <p class="price-label">Seuil de Prix</p>
        <p class="price-value">${{ formatPrice(threshold.thresholdPrice) }}</p>
      </div>
      <div class="threshold-actions">
        <router-link :to="`/admin/threshold/${threshold._id}`" class="btn btn-secondary">Modifier</router-link>
        <button class="btn btn-danger" @click="confirmDelete">Supprimer</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ThresholdItem',
    props: {
      threshold: {
        type: Object,
        required: true
      }
    },
    methods: {
      formatPrice(price) {
        return parseFloat(price).toFixed(2);
      },
      confirmDelete() {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le seuil pour ${this.threshold.symbol}?`)) {
          this.$emit('delete', this.threshold._id);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .threshold-item {
    padding: 20px;
    transition: transform 0.3s ease;
  }
  
  .threshold-item:hover {
    transform: translateY(-5px);
  }
  
  .threshold-header {
    margin-bottom: 16px;
  }
  
  .threshold-symbol {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 5px 0;
  }
  
  .threshold-name {
    font-size: 16px;
    color: #718096;
    margin: 0;
  }
  
  .threshold-price {
    margin-bottom: 20px;
  }
  
  .price-label {
    font-size: 14px;
    color: #718096;
    margin: 0 0 5px 0;
  }
  
  .price-value {
    font-size: 22px;
    font-weight: 600;
    color: #4a6cf7;
    margin: 0;
  }
  
  .threshold-actions {
    display: flex;
    gap: 10px;
  }
  </style>