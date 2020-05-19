module.exports = {
  plugins: [
    require('autoprefixer'),
    require('tailwindcss'),
  ],
  purge: {
    purge: {
      enabled: process.env.NODE_ENV === 'production',
      content: [
        './public/**/*.html',
        './src/**/*.vue'
      ]
    },
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './public/**/*.html',
      './src/**/*.vue'
    ]
  }
}