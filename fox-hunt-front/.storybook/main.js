const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app',
  ],
  refs: {
    'common-front': {
      title: 'Common front components',
      url: 'http://localhost:6006/',
      expanded: false,
    },
    'fox-hunt-organization-front': {
      title: 'Foxhunt Organization',
      url: 'http://localhost:6007/',
      expanded: false,
    },
  },
  framework: '@storybook/react',
  features: {
    emotionAlias: false,
  },
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config) => {
    config.resolve.modules.push(path.resolve(__dirname, '../'));
    config.resolve.modules.push(path.resolve(__dirname, '../node_modules'));

    return config;
  },
};
