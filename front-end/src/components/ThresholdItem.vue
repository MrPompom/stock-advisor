<!-- front-end/src/components/ThresholdItem.vue -->
<template>
  <div class="threshold-item card" :class="{ 'inactive': !threshold.isActive }">
    <div class="status-badge" :class="{ 'active': threshold.isActive, 'inactive': !threshold.isActive }">
      {{ threshold.isActive ? 'Actif' : 'Inactif' }}
    </div>
    
    <!-- Nouveau badge pour le type d'action -->
    <div class="action-type-badge" :class="threshold.actionType">
      {{ threshold.actionType === 'acheter' ? 'ACHAT' : 'VENTE' }}
    </div>
    
    <div class="threshold-header">
      <h3 class="threshold-name">{{ threshold.name }}</h3>
      <p class="threshold-symbol">{{ threshold.symbol }}</p>
    </div>
    
    <div class="threshold-info">
      <div class="threshold-price">
        <p class="price-label">Seuil de Prix</p>
        <p class="price-value">${{ formatPrice(threshold.thresholdPrice) }}</p>
      </div>
      
      <!-- Nouveau: Affichage de l'indice de risque -->
      <div class="risk-level">
        <p class="risk-label">Niveau de risque</p>
        <div class="risk-badge" :class="`risk-${threshold.riskLevel}`">
          {{ capitalizeRisk(threshold.riskLevel) }}
        </div>
      </div>
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
    capitalizeRisk(risk) {
      if (!risk) return '';
      return risk.charAt(0).toUpperCase() + risk.slice(1);
    },
    confirmDelete() {
      if (confirm(`Êtes-vous sûr de vouloir supprimer le seuil pour ${this.threshold.symbol}?`)) {
        this.$emit('delete', this.threshold._id);
      }
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

/* Nouveau badge pour le type d'action */
.action-type-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.action-type-badge.acheter {
  background-color: #c6f6d5;
  color: #2f855a;
}

.action-type-badge.vendre {
  background-color: #fed7d7;
  color: #e53e3e;
}

.threshold-header {
  margin-bottom: 16px;
  padding-left: 60px; /* Espace pour le badge de type */
  padding-right: 70px; /* Espace pour le badge de statut */
}

.threshold-symbol {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

.threshold-name {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 5px 0;
}

.threshold-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.threshold-price, .risk-level {
  flex: 1;
}

.price-label, .risk-label {
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

/* Styles pour les badges de risque */
.risk-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
}

.risk-faible {
  background-color: #c6f6d5;
  color: #2f855a;
}

.risk-moyen {
  background-color: #fefcbf;
  color: #d69e2e;
}

.risk-elevé {
  background-color: #fed7d7;
  color: #e53e3e;
}

.risk-sevère {
  background-color: #e53e3e;
  color: white;
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