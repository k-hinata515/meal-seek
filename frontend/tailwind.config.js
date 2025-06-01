/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ライトテーマの基本色
        'light-bg': '#F7FAFC',
        'light-text': '#2D3748',
        'light-heading': '#2B6CB0',
        'light-accent': '#3182CE',
        'light-card-bg': '#FFFFFF',
        'light-border': '#E2E8F0',
        'light-input-bg': '#FFFFFF',
        'light-input-focus-border': '#3182CE',
        'light-tag-bg': '#EBF8FF',
        'light-tag-text': '#2B6CB0',
        'light-tag-selected-bg': '#3182CE',
        'light-tag-selected-text': '#FFFFFF',
        'light-header-bg': 'rgba(247, 250, 252, 0.85)',
        'light-header-border': '#E2E8F0',
        'light-footer-bg': 'rgba(247, 250, 252, 0.70)', 
        'light-footer-text': '#718096', 

        // ダークテーマの基本色
        'dark-bg': '#1A202C',
        'dark-text': '#E2E8F0',
        'dark-heading': '#90CDF4',
        'dark-accent': '#63B3ED',
        'dark-card-bg': '#2D3748',
        'dark-border': '#4A5568',
        'dark-input-bg': '#2D3748',
        'dark-input-focus-border': '#63B3ED',
        'dark-tag-bg': '#4A5568',
        'dark-tag-text': '#BEE3F8',
        'dark-tag-selected-bg': '#63B3ED',
        'dark-tag-selected-text': '#1A202C',
        'dark-header-bg': 'rgba(26, 32, 44, 0.85)',
        'dark-header-border': '#4A5568',
        'dark-footer-bg': 'rgba(26, 32, 44, 0.70)',  
        'dark-footer-text': '#A0AEC0', 
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}