// babel.config.cjs
module.exports = {
  presets: [
    // Traduce JS moderno (ES6+) a lo que entienda el entorno actual (node/jest)
    ['@babel/preset-env', { targets: { node: 'current' } }],
    
    // Traduce JSX usando el runtime automático de React (no necesita importar React)
    ['@babel/preset-react', { runtime: 'automatic' }],

    // Soporte para TypeScript
    ['@babel/preset-typescript']
  ],
  plugins: [
    // Permite usar import.meta (transforma a CommonJS para Jest)
    ['babel-plugin-transform-import-meta', { target: 'CommonJS' }]
  ]
};
