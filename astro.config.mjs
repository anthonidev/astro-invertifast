import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";



// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), icon()],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    }
  },
  image: {
    // Ejemplo: Permite la optimización de imágenes remotas desde un solo dominio
    domains: ['astro.build'],
  },
});