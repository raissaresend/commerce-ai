// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
    // Informa ao Tailwind quais arquivos monitorar para encontrar classes
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Inclui todos os arquivos dentro de /src
    ],
  
    theme: {
      extend: {
        // Bloco de cores personalizadas
        colors: {
          'primary': {
            '50': '#eef2ff',
            '100': '#e0e7ff',
            '200': '#c7d2fe',
            '300': '#a5b4fc',
            '400': '#818cf8',
            '500': '#6366f1', // Azul principal (para botões, links)
            '600': '#4f46e5', // Azul mais escuro
            '700': '#4338ca',
            '800': '#3730a3',
            '900': '#312e81',
            '950': '#1e1b4b',
          },
          'secondary': {
            '50': '#f0fdf4',
            '100': '#dcfce7',
            '200': '#bbf7d0',
            '300': '#86efac',
            '400': '#4ade80',
            '500': '#22c55e', // Verde principal (para sucesso, botões "novo")
            '600': '#16a34a', // Verde mais escuro
            '700': '#15803d',
            '800': '#166534',
            '900': '#14532d',
            '950': '#052e16',
          }
        }
      },
    },
  
    plugins: [],
  }