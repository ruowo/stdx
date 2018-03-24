const fs = require('fs')
const path = require('path')
const {exist, spawn} = require('./util.js')
const {name, version} = require('../package.json')

exist(path.join(__dirname, '../platform'))
  .then((exist) => {
    if (!exist) {
      let npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
      let pkgMap = {
        win32: 'win',
        darwin: 'mac'
      }
      let pkg = pkgMap[process.platform] || 'linux'
      return spawn(npm, [
        'install' , '--production', `${name}-${pkg}@${version}`
      ])
    }
  })
