const {copyFile, spawn, nodeVersion, plog} = require('./util.js')
const path = require('path')
const fs = require('fs')

function downloadNodeSassAddions () {
  let dirMap = {
    win32: 'win',
    darwin: 'mac'
  }
  // , 'freebsd', 'linux_musl'
  return Promise.all(['win32', 'darwin', 'linux'].map(it => {
    let dir = dirMap[it] || 'linux'
    let binPath = require('node-sass/lib/extensions').getBinaryPath()
    // \stdx\node_modules\node-sass\vendor\win32-x64-57\binding.node
    binPath = path.join(__dirname, '../platform/$DIR$', path.relative(path.join(path.dirname(__dirname), 'node_modules'), binPath));
    // ..\platform\$DIR$\node-sass\vendor\win32-x64-57\binding.node
    binPath = binPath.replace(`${process.platform}-`, '$SYSTEM$')
    // ..\platform\$DIR$\node-sass\vendor\$SYSTEM$-x64-57\binding.node
    return spawn(path.join(__dirname, 'pnode', 'pnode-' + process.platform), 
      [require.resolve('node-sass/scripts/install')],
      {
        env: {
          SASS_CUSTOM_PLATFORM: it,
          SASS_BINARY_PATH: binPath.replace('$DIR$', dir).replace('$SYSTEM$', `${it}-`)
        }
      }
    )
  })).then(plog('downloadNodeSassAddions', 'done.'))
}

module.exports = {
  downloadNodeSassAddions, // 下载node-sass各个平台的插件包
}
