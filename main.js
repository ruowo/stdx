const path = require('path')
var Module = require('module')

process.env.ENTRYMODULE = path.join(__dirname, 'node_modules')

const commands = require('./apps.js')

const entries = Object.keys(commands)

let args = process.argv.slice(2)
let app = args[0]
let entrypoint

if (entries.indexOf(app) !== -1) {
  process.argv.splice(2, 1)
  entrypoint = commands[app].bin
} else {
  process.argv.splice(1, 1)
  entrypoint = process.argv[1]
}

var ancestor = {}

ancestor.require = Module.prototype.require
ancestor._resolveFilename = Module._resolveFilename
ancestor._compile = Module.prototype._compile

// function test (func, file, args) {
//   if (file.indexOf('vue-template-compiler') !== -1) {
//     console.log(func, file, args, process.cwd())
//   }
// }

Module.prototype.require = function (file) {
  var args = arguments
  if (file) {
    var filename = file.split('/')[0]
    if (entries.indexOf(filename) !== -1) {
      args[0] = path.join(__dirname, 'node_modules', file)
    }
    // test('require', file, args)
  }
  return ancestor.require.apply(this, args)
}

Module.prototype._compile = function (content, filename_) {
  var args = arguments
  if (filename_) {
    var filename = filename_.split('/')[0]
    if (entries.indexOf(filename) !== -1) {
      args[0] = path.join(__dirname, 'node_modules', filename_)
    }
    // test('_compile', filename_, args)
  }
  return ancestor._compile.apply(this, args)
}

Module._resolveFilename = function (file) {
  var args = arguments
  if (file) {
    var filename = file.split('/')[0]
    if (entries.indexOf(filename) !== -1) {
      args[0] = path.join(__dirname, 'node_modules', args[0])
    }
    // test('_resolveFilename', file, args)
  }
  return ancestor._resolveFilename.apply(this, args)
}

if (0) {

// nyc ava test
require.resolve('babel-register')
require.resolve('chai')
require.resolve('babel-eslint')
require.resolve('babel-core')

// vue
require.resolve('vue')
require.resolve('vue-template-compiler')
require.resolve('vue-server-renderer')

// ava vue test
require.resolve('require-extension-hooks')
require.resolve('require-extension-hooks-vue')
require.resolve('require-extension-hooks-babel')
require.resolve('browser-env')
require.resolve('@vue/test-utils')

// express
require.resolve('express')
require.resolve('socket.io')
require.resolve('es6-promise')

require('./apps-resolve.js')

}

if (entrypoint) {
  Module._load(entrypoint, null, true)
  process._tickCallback() 
}
