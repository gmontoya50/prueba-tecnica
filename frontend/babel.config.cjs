module.exports = {
  presets: [
    // Traduce JS moderno (ES6+) a lo que entienda el entorno actual (node/jest)
    ['@babel/preset-env', { targets: { node: 'current' } }],
    
    // Traduce JSX a React.createElement (o el nuevo runtime automático)
    ['@babel/preset-react', { runtime: 'automatic' }],

    ['@babel/preset-typescript']
  ]
};
