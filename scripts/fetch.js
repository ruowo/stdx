const {targets, copyFile, spawn, nodeVersion, plog} = require('./util.js')
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')

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

function copyUws () {
  return spawn(path.join(__dirname, 'pnode', 'pnode-' + process.platform), 
    ['-m'], {stdio: null}
  ).then((m) => Promise.all(Object.keys(targets).map(it => {
    let src = require.resolve(`uws/uws_${targets[it].platform}_${m.stdout.trim()}.node`)
    let dest = path.resolve(__dirname, `../platform/${it}/uws`)
    return fse.ensureDir(dest).then(() => {
      let dist = path.join(dest, path.basename(src))
      return fse.copyFile(src, dist)
        .then(plog('copy uws', dist))
    })
  }))).then(plog('copyUws', 'done.'))
}

module.exports = {
  downloadNodeSassAddions, // 下载node-sass各个平台的插件包
  copyUws, // 复制uws插件包
}
