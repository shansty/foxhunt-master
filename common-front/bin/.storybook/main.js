const path = require('path');

module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-scss',
    '@storybook/addon-webpack5-compiler-babel',
    '@chromatic-com/storybook'
  ],

  refs: {
    'fox-hunt-organization-front': {
      title: 'Foxhunt Organization',
      url: 'http://localhost:6007/',
      expanded: false,
    },
    'fox-hunt-front': {
      title: 'Foxhunt Admin',
      url: 'http://localhost:6008/',
      expanded: false,
    },
  },

  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },

  features: {
    emotionAlias: false,
  },

  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    config.resolve.modules.push(path.resolve(__dirname, '../'));
    config.resolve.modules.push(path.resolve(__dirname, '../node_modules'));

    return config;
  },

  docs: {
    autodocs: true
  }
};
