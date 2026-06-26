import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom', // Úsalo si pruebas componentes de frontend (React/Vue)
    globals: true,        // Permite usar 'test' o 'describe' sin importar desde 'vitest'
  },
})
