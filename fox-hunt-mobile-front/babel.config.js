module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env.development',
        path: '.env.development',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
      'development',
    ],
  ],
};
