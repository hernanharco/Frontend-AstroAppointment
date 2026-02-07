import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite'; // Importamos el plugin de Vite

export default defineConfig({
  // Quitamos tailwind() de integrations y lo ponemos en vite plugins
  integrations: [react()], 
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      PUBLIC_API_URL: envField.string({
        context: 'client',
        access: 'public',
        default: 'http://localhost:8000/api/v1',
      }),
    },
  },
});