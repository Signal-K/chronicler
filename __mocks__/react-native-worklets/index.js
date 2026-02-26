// Web-safe mock implementation for react-native-worklets.
const id = (value) => value;
const noop = () => {};
const passthroughThunk = (fn) => (...args) => fn(...args);

const RuntimeKind = {
  JS: 'js',
  UI: 'ui',
};

module.exports = {
  // Reanimated validates worklets version via require('react-native-worklets/package.json').
  // Our Metro alias routes that import here in web/SSR, so expose a compatible version.
  version: '0.5.1',
  RuntimeKind,
  WorkletsModule: {},
  bundleModeInit: noop,
  callMicrotasks: noop,
  createSerializable: id,
  createSynchronizable: id,
  createWorkletRuntime: noop,
  executeOnUIRuntimeSync: noop,
  getRuntimeKind: () => RuntimeKind.JS,
  getStaticFeatureFlag: () => false,
  init: noop,
  isSerializableRef: () => false,
  isShareableRef: () => false,
  isSynchronizable: () => false,
  isWorkletFunction: () => false,
  makeShareable: id,
  makeShareableCloneOnUIRecursive: id,
  makeShareableCloneRecursive: id,
  runOnJS: passthroughThunk,
  runOnRuntime: passthroughThunk,
  runOnUI: passthroughThunk,
  runOnUIAsync: passthroughThunk,
  runOnUISync: passthroughThunk,
  scheduleOnRN: passthroughThunk,
  scheduleOnUI: passthroughThunk,
  serializableMappingCache: new WeakMap(),
  setDynamicFeatureFlag: noop,
  shareableMappingCache: new WeakMap(),
  unstable_eventLoopTask: noop,
};

module.exports.default = module.exports;
