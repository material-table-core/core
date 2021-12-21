/**
 * This file is needed for Jest
 */
module.exports = {
  presets: ['@babel/preset-env', '@babel/react'],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@components': './src/components',
          '@store': './src/store',
          '@utils': './src/utils'
        }
      }
    ],
    [
      'import',
      {
        libraryName: '@material-ui/core',
        libraryDirectory: '',
        camel2DashComponentName: false
      },
      '@material-ui/core'
    ],
    [
      'import',
      {
        libraryName: '@material-ui/icons',
        libraryDirectory: '',
        camel2DashComponentName: false
      },
      '@material-ui/icons'
    ]
  ]
};
