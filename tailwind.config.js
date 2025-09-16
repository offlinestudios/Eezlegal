/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'chat-bg': '#f7f7f8',
        'chat-surface': '#ffffff',
        'chat-border': '#d1d5db',
        'chat-text': '#2d333a',
        'chat-text-dim': '#6e7681',
      },
    },
  },
  plugins: [],
}

