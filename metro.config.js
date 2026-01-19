const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
// Support importing SVGs as React components via react-native-svg-transformer
try {
  const resolver = config.resolver || {};
  const assetExts = resolver.assetExts || [];
  const sourceExts = resolver.sourceExts || [];

  // remove svg from assetExts and add to sourceExts
  config.resolver = {
    ...resolver,
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: Array.from(new Set([...(sourceExts || []), 'svg'])),
  };

  config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
} catch (e) {
  // ignore if transformer isn't installed yet
}

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
  alias: {
    '@': __dirname,
  },
  resolveRequest: (context, moduleName, platform) => {
    // Handle @ alias
    if (moduleName.startsWith('@/')) {
      const relativePath = moduleName.replace('@/', '');
      return {
        filePath: path.resolve(__dirname, relativePath),
        type: 'sourceFile',
      };
    }
    
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

// Ensure blockList is properly configured
config.resolver.blockList = config.resolver.blockList || [];

// Add to watchFolders to include the directory containing the problematic file
config.watchFolders = [
  ...config.watchFolders,
  `${__dirname}/__mocks__/react-native-worklets`,
];

module.exports = config;
