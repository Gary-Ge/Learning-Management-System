const path = require('path');

module.exports = {
  webpack: function (config, env) {
    const stompLoaderRule = {
      test: /stomp\.umd\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            configFile: path.resolve(__dirname, '.babelrc')
          }
        }
      ]
    };

    // Find the rule that handles JavaScript files
    const jsRuleIndex = config.module.rules.findIndex(rule => rule.test && rule.test.test('.js'));
    if (jsRuleIndex !== -1) {
      // Insert the stompLoaderRule before the JavaScript rule
      config.module.rules.splice(jsRuleIndex, 0, stompLoaderRule);
    } else {
      // If there's no JavaScript rule, just push the stompLoaderRule
      config.module.rules.push(stompLoaderRule);
    }

    return config;
  },
};
