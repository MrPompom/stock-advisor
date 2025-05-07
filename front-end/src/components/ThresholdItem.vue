<!-- front-end/src/components/ThresholdItem.vue -->
<template>
  <div class="threshold-item card" :class="{ 'inactive': !threshold.isActive }">
    <div class="status-badge" :class="{ 'active': threshold.isActive, 'inactive': !threshold.isActive }">
      {{ threshold.isActive ? 'Actif' : 'Inactif' }}
    </div>
    
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
    },
    isActive() {
      console.log(this.threshold.isActive)
    },
    toggleActive() {
      this.$emit('toggle-active', {
        id: this.threshold._id,
        isActive: !this.threshold.isActive
      });
    }
  }
};
</script>

<style scoped>
.threshold-item {
  padding: 20px;
  transition: transform 0.3s ease;
  position: relative;
  border-left: 4px solid #4a6cf7;
}

.threshold-item:hover {
  transform: translateY(-5px);
}

.threshold-item.inactive {
  border-left-color: #a0aec0;
  background-color: #f7fafc;
  opacity: 0.8;
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background-color: #c6f6d5;
  color: #2f855a;
}

.status-badge.inactive {
  background-color: #e2e8f0;
  color: #718096;
}

.threshold-header {
  margin-bottom: 16px;
  padding-right: 70px; /* Espace pour le badge */
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
  flex-wrap: wrap;
}

.btn-warning {
  background-color: #f6ad55;
  color: white;
}

.btn-warning:hover {
  background-color: #ed8936;
}

.btn-success {
  background-color: #48bb78;
  color: white;
}

.btn-success:hover {
  background-color: #38a169;
}
</style>