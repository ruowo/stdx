module.exports = {
  'webpack': {
    bin: 'webpack-cli/bin/webpack.js',
    api: [
          'webpack',
          'webpack-sources',
          'webpack-merge',
          'webpack-dev-middleware',
          'webpack-dev-addons',
          'webpack-log',
          'html-webpack-plugin',
          'sass-loader',
          'css-loader',
          'vue-loader',
          'style-loader',
          'file-loader',
          'url-loader',
          'webpack-bundle-analyzer',
          'vue-style-loader',
          'vue-html-loader',
          'uglifyjs-webpack-plugin',
          'svg-sprite-loader',
          'chalk',
          'ora',
          'rimraf',
          'semver',
          'shelljs',
          'copy-webpack-plugin',
          'babel-loader'
          ]
  },
  'webpack-dev-server': {
    bin: 'webpack-dev-server/bin/webpack-dev-server.js',
    api: 'webpack-dev-server'
  },
  nyc: {
    bin: 'nyc/bin/nyc.js',
    api: [
      'nyc',
      'nyc/bin/wrap.js',
    ]
  },
  ava: {
    bin: 'ava/cli.js',
    api: 'ava'
  },
  standard: {
    bin: 'standard/bin/cmd.js',
    api: [
      'standard',
      'eslint-plugin-vue',
      'eslint-plugin-html',
    ]
  },
  rollup: {
    bin: 'rollup/bin/rollup',
    api: [
      'rollup',
      'rollup-pluginutils',
      'rollup-plugin-node-resolve',
      'rollup-plugin-commonjs',
      'rollup-plugin-json',
      'rollup-plugin-includepaths',
      'rollup-plugin-babel',
      'rollup-plugin-uglify',
      'rollup-plugin-vue',
      'rollup-plugin-re',
      'rollup-plugin-serve',
      'rollup-plugin-livereload',
      'rollup-plugin-node-globals',
      'rollup-plugin-alias',
      'rollup-plugin-conditional',
      'rollup-plugin-multi-entry',
    ]
  },
  uglifyjs: {
    bin: 'uglify-es/bin/uglifyjs',
    api: 'uglify-es'
  },
  lessc: {
    bin: 'less/bin/lessc'
  },
  stylus: {
    bin: 'stylus/bin/stylus'
  },
  "node-sass": {
    bin: 'node-sass/bin/node-sass',
    api: 'node-sass'
  },
  'standard-sass': {
    bin: 'standard-sass/dist/standard-sass.js'
  },
  'babel': {
    bin: "babel-cli/bin/babel.js",
    api: [
      'babel-plugin-transform-object-rest-spread',
      'babel-plugin-transform-decorators-legacy',
      'babel-plugin-transform-class-properties',
      'babel-plugin-syntax-function-bind',
      'babel-preset-env',
      'babel-preset-react',
      'babel-preset-stage-0',
      'babel-preset-stage-1',
      'babel-preset-stage-2',
      'babel-preset-stage-3'
    ]
  },
  'babel-node': {
    bin: "babel-cli/bin/babel-node.js"
  },
  'which': {
    bin: 'which/bin/which'
  },
  'uuid': {
    bin: 'uuid/bin/uuid'
  },
  'watch': {
    bin: 'watch-cli/bin/watch'
  },
  'cross-env': {
    bin: 'cross-env/dist/bin/cross-env.js'
  },
  'cross-env-shell': {
    bin: 'cross-env/dist/bin/cross-env-shell.js'
  },
  'npm-run-all': {
    bin: 'npm-run-all/bin/npm-run-all/index.js'
  },
  'run-p': {
    bin: 'npm-run-all/bin/run-p/index.js'
  },
  'run-s': {
    bin: 'npm-run-all/bin/run-s/index.js'
  },
  'hs': {
    bin: 'http-server/bin/http-server'
  },
  'lerna': {
    bin: 'lerna/bin/lerna.js'
  },
  'npm-check': {
    bin: 'npm-check/bin/cli.js'
  }
}
