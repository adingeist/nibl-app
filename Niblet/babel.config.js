module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          alias: {
            '@src': './src',
            '@src/': './src',
            '@shared': './shared',
            '@shared/': './shared',
          },
        },
      ],
      'react-native-paper/babel',
      'react-native-reanimated/plugin',
    ],
  };
};
