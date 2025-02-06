import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Adicione aqui as extensões que você quer que o Vite resolva automaticamente
    extensions: ['.mjs', '.js', '.ts', '.tsx', '.jsx', '.json'],
  },
})
