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

Module.prototype.require = function (file) {
  var args = arguments
  if (file) {
    var filename = file.split('/')[0]
    if (entries.indexOf(filename) !== -1) {
      args[0] = path.join(__dirname, 'node_modules', file)
      console.log('require', args)
    }
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
  }
  return ancestor._resolveFilename.apply(this, args)
}

require.resolve('babel-register')
require.resolve('chai')
require.resolve('babel-eslint')
require.resolve('babel-core')

require('./apps-resolve.js')

if (entrypoint) {
  Module._load(entrypoint, null, true)
  process._tickCallback() 
}
