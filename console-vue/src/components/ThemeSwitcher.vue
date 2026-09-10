<template>
  <div class="theme-switcher" aria-label="外观模式">
    <button
      v-for="option in options"
      :key="option.value"
      class="theme-option"
      :class="{ active: themeMode === option.value }"
      type="button"
      :title="option.label"
      :aria-label="option.label"
      :aria-pressed="themeMode === option.value"
      @click="setTheme(option.value)"
    >
      <el-icon><component :is="option.icon" /></el-icon>
      <span>{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

const options = [
  { value: 'light', label: '浅色', icon: 'Sunny' },
  { value: 'dark', label: '深色', icon: 'Moon' },
  { value: 'system', label: '跟随系统', icon: 'Monitor' }
]

const { themeMode, setTheme } = useTheme()
</script>

<style scoped>
.theme-switcher {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 4px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--surface-muted);
}

.theme-option {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 9px;
  border: 0;
  border-radius: 8px;
  color: var(--text-secondary);
  background: transparent;
  font-size: 12px;
  cursor: pointer;
  transition: color 0.2s, background 0.2s, box-shadow 0.2s;
}

.theme-option:hover {
  color: var(--text-primary);
}

.theme-option.active {
  color: var(--brand-primary);
  background: var(--surface-color);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 680px) {
  .theme-option span {
    display: none;
  }

  .theme-option {
    padding: 0 8px;
  }
}
</style>
