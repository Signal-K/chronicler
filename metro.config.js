const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add HTML plugin to inject PWA manifest
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Add resolver config to handle web-specific module resolution
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Replace worklets with mock on web
    if (platform === 'web') {
      if (moduleName === 'react-native-worklets' || moduleName === 'react-native-worklets-core') {
        return {
          filePath: path.resolve(__dirname, '__mocks__/react-native-worklets/index.js'),
          type: 'sourceFile',
        };
      }
    }
    
    // Use default resolver
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
