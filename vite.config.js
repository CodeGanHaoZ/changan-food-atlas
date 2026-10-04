import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 部署在 https://codeganhaoz.github.io/changan-food-atlas/，需设置 base
export default defineConfig({
  base: '/changan-food-atlas/',
  plugins: [react()],
})
