/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 50:'#eeedff',100:'#d9d6ff',200:'#b7b0ff',300:'#9488ff',400:'#6c63ff',500:'#5a4ff0',600:'#4d40dc',700:'#3f33b8',800:'#342b94',900:'#2b2778' },
        accent: { 50:'#fff0f3',100:'#ffe0e6',200:'#ffc6d1',300:'#ff9db0',400:'#ff6584',500:'#ff3d6a',600:'#ed1a50',700:'#c8103e',800:'#a50e37',900:'#880e32' },
        surface: { 50:'#f8f9ff',100:'#eef0ff',200:'#dde0ff',800:'#1a1845',900:'#0f0c29',950:'#0a0820' },
      },
      fontFamily: { sans:['Poppins','sans-serif'], urdu:['Noto Nastaliq Urdu','serif'] },
      animation: {
        'gradient-x':'gradient-x 15s ease infinite',
        'float':'float 6s ease-in-out infinite',
        'fade-in':'fade-in 0.5s ease-out',
        'slide-up':'slide-up 0.5s ease-out',
      },
      keyframes: {
        'gradient-x':{ '0%,100%':{ backgroundPosition:'0% 50%' },'50%':{ backgroundPosition:'100% 50%' } },
        'float':{ '0%,100%':{ transform:'translateY(0px)' },'50%':{ transform:'translateY(-20px)' } },
        'fade-in':{ '0%':{ opacity:'0' },'100%':{ opacity:'1' } },
        'slide-up':{ '0%':{ opacity:'0',transform:'translateY(20px)' },'100%':{ opacity:'1',transform:'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
