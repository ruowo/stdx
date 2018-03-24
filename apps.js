module.exports = {
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
    bin: "babel-cli/bin/babel.js"
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
  'hs': {
    bin: 'http-server/bin/http-server'
  }
}
