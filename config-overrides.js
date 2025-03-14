// config-overrides.js
const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add environment variables for build time
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.BUILD_TIME': 'true',
      'process.env.REACT_APP_DISABLE_OIDC': JSON.stringify('true')
    })
  );

  // Find the sass-loader rule
  const oneOfRule = config.module.rules.find(rule => rule.oneOf);
  if (oneOfRule) {
    const sassRule = oneOfRule.oneOf.find(rule => 
      rule.test && rule.test.toString().includes('scss|sass')
    );
    
    if (sassRule && sassRule.use) {
      // Find the sass-loader
      const sassLoaderIndex = sassRule.use.findIndex(loader => 
        loader && (typeof loader === 'string' ? loader.includes('sass-loader') : loader.loader && loader.loader.includes('sass-loader'))
      );
      
      if (sassLoaderIndex !== -1) {
        // Get the sass-loader
        const sassLoader = sassRule.use[sassLoaderIndex];
        
        // If it's a string, convert it to an object
        if (typeof sassLoader === 'string') {
          sassRule.use[sassLoaderIndex] = {
            loader: sassLoader,
            options: {
              sassOptions: {
                quietDeps: true,  // This silences deprecation warnings from dependencies
                logger: {
                  warn: function(message) {
                    // Filter out deprecation warnings
                    if (!message.includes('Deprecation')) {
                      console.warn(message);
                    }
                  }
                }
              }
            }
          };
        } else if (typeof sassLoader === 'object') {
          // If it's already an object, add our options
          sassLoader.options = sassLoader.options || {};
          sassLoader.options.sassOptions = sassLoader.options.sassOptions || {};
          sassLoader.options.sassOptions.quietDeps = true;
          sassLoader.options.sassOptions.logger = {
            warn: function(message) {
              // Filter out deprecation warnings
              if (!message.includes('Deprecation')) {
                console.warn(message);
              }
            }
          };
        }
      }
    }
  }

  // Optimize chunks and minimize
  config.optimization = {
    ...config.optimization,
    minimize: true,
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  };

  return config;
};
