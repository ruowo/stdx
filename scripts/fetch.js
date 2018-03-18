const {addToCacheList, copyFile, spawn, nodeVersion, plog} = require('./util.js')
const path = require('path')
const fs = require('fs')

function downloadNodeSassAddions () {
  return Promise.all(['win32', 'darwin', 'linux', 'freebsd', 'linux_musl'].map(it => {
    return spawn(path.join(__dirname, 'pnode/pnode'), 
      [require.resolve('node-sass/scripts/install')],
      {
        env: {
          SASS_CUSTOM_PLATFORM: it
        },
        stdio: false
      }
    ).then((res) => {
      let {stdout} = res
      let str = path.normalize('node_modules/node-sass/vendor')
      let pos = stdout.indexOf(str)
      let end = stdout.indexOf('\n', pos)
      str = stdout.substr(pos, end <= 0 ? stdout.length : end).trim()
      let src = path.normalize(path.dirname(__dirname) + '/' + str)
      let dest = path.join(__dirname, '../cache', 
        str.replace(new RegExp(`\\${path.sep}`, 'g'), '@'))
      let info = {
        nodeVersion,
        platform: ['freebsd', 'linux_musl'].indexOf(it) !== -1 ? 'linux' : it,
        src,
        dest
      }
      return copyFile(src, dest).then(() => {
        addToCacheList(info)
        plog('downloadNodeSassAddion', str)()
      })
    })
  })).then(plog('downloadNodeSassAddions', 'done.'))
}

module.exports = {
  downloadNodeSassAddions, // 下载node-sass各个平台的插件包
}
