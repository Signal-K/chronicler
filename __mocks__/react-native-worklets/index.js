// Mock for react-native-worklets on web
const Worklets = {
  createWorklet: (fn) => fn,
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  createSharedValue: (val) => ({ value: val }),
  assertWorkletsVersion: () => {},
  createJSReanimatedModule: () => ({}),
};

module.exports = Worklets;
module.exports.Worklets = Worklets;
module.exports.default = Worklets;
