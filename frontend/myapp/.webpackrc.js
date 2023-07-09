const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /stomp\.umd\.js$/,
        use: [
          {
            loader: 'imports-loader',
            options: {
              imports: [
                'default net',
                'default url',
                'default tls',
                'default http',
                'default https',
                'default zlib',
                'default crypto',
                'default os',
                'default path',
              ],
            },
          },
        ],
      },
    ],
  },
};
