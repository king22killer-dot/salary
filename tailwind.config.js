/** 薪資出勤：Tailwind 設定（改完樣式要跑 npm run build:css 產生 app.css） */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        // 主題色：深邃藍
        brand: {
          50: '#eef4ff', 100: '#dbe6fe', 200: '#bfd3fe', 300: '#93b4fd', 400: '#608bfa',
          500: '#3b66f5', 600: '#2549e0', 700: '#1d3ac4', 800: '#1e339e', 900: '#1e2f7d', 950: '#151d4b'
        },
        ink: '#0f1f3d'
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"PingFang TC"', '"Noto Sans TC"', 'sans-serif']
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,31,61,.04), 0 4px 16px rgba(15,31,61,.06)'
      }
    }
  },
  plugins: []
};
