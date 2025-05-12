<!-- front-end/src/components/StockItem.vue -->
<template>
    <div class="stock-item card" :class="{ 'recommended': stock.isRecommended }">
      <div class="stock-header">
        <h3 class="stock-name">{{ stock.name }}</h3>
        <p class="stock-symbol">{{ stock.symbol }}</p>
      </div>
      <div class="stock-details">
        <div class="stock-price">
          <p class="price-label">Prix Actuel</p>
          <p class="price-value">€{{ formatPrice(stock.price) }}</p>
        </div>
        <div class="stock-threshold">
          <p class="threshold-label">Seuil Recommandé</p>
          <p class="threshold-value">€{{ formatPrice(stock.thresholdPrice) }}</p>
        </div>
      </div>
      <div class="stock-recommendation" v-if="stock.isRecommended">
        <span class="recommendation-icon">✓</span>
        <span class="recommendation-text">Recommandé à l'achat</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StockItem',
    props: {
      stock: {
        type: Object,
        required: true
      }
    },
    methods: {
      formatPrice(price) {
        return parseFloat(price).toFixed(2);
      },
      formatChange(change) {
        return change > 0 ? `+${this.formatPrice(change)}` : this.formatPrice(change);
      },
      getChangeClass(change) {
        return change >= 0 ? 'positive' : 'negative';
      }
    }
  };
  </script>
  
  <style scoped>
  .stock-item {
    padding: 20px;
    transition: transform 0.3s ease;
  }
  
  .stock-item:hover {
    transform: translateY(-5px);
  }
  
  .stock-header {
    margin-bottom: 16px;
  }
  
  .stock-symbol {
    font-size: 16px;
    color: #718096;
    margin: 0;
  }
  
  .stock-name {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 5px 0;
  }
  
  .stock-details {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 15px;
  }
  
  .stock-price, .stock-change, .stock-threshold {
    flex: 1;
    min-width: 100px;
  }
  
  .price-label, .change-label, .threshold-label {
    font-size: 14px;
    color: #718096;
    margin: 0 0 5px 0;
  }
  
  .price-value, .change-value, .threshold-value {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
  
  .stock-recommendation {
    margin-top: 15px;
    padding: 8px 12px;
    background-color: rgba(47, 133, 90, 0.1);
    border-radius: 4px;
    display: flex;
    align-items: center;
  }
  
  .recommendation-icon {
    margin-right: 8px;
    color: #2f855a;
    font-weight: bold;
  }
  
  .recommendation-text {
    color: #2f855a;
    font-weight: 600;
  }
  </style>