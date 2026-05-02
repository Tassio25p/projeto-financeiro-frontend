/** @type {import('tailwindcss').Config} */
export default {
  // O segredo está aqui: o Tailwind vai olhar o index.html e TUDO dentro de src
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#0d9488',
          orange: '#ea580c',
          bg: '#f8fafc',
          card: '#ffffff'
        }
      }
    },
  },
  plugins: [],
}