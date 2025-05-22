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
    'fox-hunt-front': {
      title: 'Foxhunt Admin',
      url: 'http://localhost:6008/',
    },
  },
  framework: '@storybook/react',
  features: {
    emotionAlias: false,
  },
  core: {
    builder: '@storybook/builder-webpack5',
  },
};
