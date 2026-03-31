<script setup lang="ts">
defineProps<{
  modelValue: string;
  tabs: { id: string; label: string }[];
}>();

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="tab-menu">
    <div class="tab-items">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="{ active: modelValue === tab.id }"
        @click="$emit('update:modelValue', tab.id)"
        class="tab-btn"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tab-indicator-bg">
      <div 
        class="tab-indicator" 
        :style="{ 
          width: `${100 / tabs.length}%`, 
          transform: `translateX(${tabs.findIndex(t => t.id === modelValue) * 100}%)` 
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.tab-menu {
  position: relative;
  width: 100%;
  background: #F8F9FA;
  padding: 0.4rem;
  border-radius: 18px;
  border: 1px solid #EDEDED;
  margin-bottom: 2.5rem;
}

.tab-items {
  display: flex;
  position: relative;
  z-index: 2;
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 0.8rem;
  font-size: 0.75rem;
  font-weight: 900;
  color: #94A3B8;
  cursor: pointer;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.tab-btn.active {
  color: #000;
}

.tab-indicator-bg {
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  right: 0.4rem;
  bottom: 0.4rem;
  z-index: 1;
}

.tab-indicator {
  height: 100%;
  background: #FFFFFF;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}
</style>
