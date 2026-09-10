import { computed, ref } from 'vue'

const STORAGE_KEY = 'shortlink-theme'
const themeMode = ref(localStorage.getItem(STORAGE_KEY) || 'system')
const systemDark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)
let initialized = false

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

const applyTheme = () => {
  const isDark = themeMode.value === 'dark' || (themeMode.value === 'system' && systemDark.value)
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.dataset.theme = themeMode.value
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
}

export const useTheme = () => {
  if (!initialized) {
    mediaQuery.addEventListener('change', (event) => {
      systemDark.value = event.matches
      applyTheme()
    })
    applyTheme()
    initialized = true
  }

  const setTheme = (mode) => {
    if (!['light', 'dark', 'system'].includes(mode)) return
    themeMode.value = mode
    localStorage.setItem(STORAGE_KEY, mode)
    applyTheme()
  }

  return {
    themeMode: computed(() => themeMode.value),
    isDark: computed(() => document.documentElement.classList.contains('dark')),
    setTheme
  }
}
