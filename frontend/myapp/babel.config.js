module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
      ['@babel/plugin-transform-runtime', { corejs: 3 }],
      ['@babel/plugin-transform-private-methods', { loose: true }]
    ]
  };
  