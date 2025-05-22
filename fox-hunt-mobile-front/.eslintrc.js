module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'plugin:react/recommended',
    'google',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    'react-hooks',
  ],
  'rules': {
    'indent': ['error', 2, { 'MemberExpression': 1, 'SwitchCase': 1 }],
    'new-cap': ['error', { 'capIsNew': false }],
    'react/prop-types': 'off',
    'max-len': ['warn', { code: 100 }],
    'object-curly-spacing': ['error', 'always'],
    'no-console': ['warn', { allow: ['warn'] }],
    'func-style': ['error', 'expression'],
    'linebreak-style': 'off',
    'react-hooks/rules-of-hooks': 'error',
    // 'react-hooks/exhaustive-deps': 'warn',
  },
};
