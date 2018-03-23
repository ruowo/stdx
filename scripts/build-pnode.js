const {spawn, plog, targets} = require('./util.js')
const path = require('path')

function buildPNode () {
  const pkg = path.resolve(`./node_modules/.bin/pkg${process.platform === 'win32' ? '.cmd' : ''}`)
  let platforms = {
    win: 'win32',
    mac: 'darwin',
  }
  // 串行
  return Object.keys(targets).reduce((ret, it) => {
    return ret.then(() => spawn(pkg, [
      '-t', targets[it].target,
      '--output', path.join(__dirname, 'pnode', 'pnode-' + (platforms[it] || 'linux')),
      '--config', 'pnode.json', 'main.js'], {
        cwd: path.join(__dirname, 'pnode')
      }).then(plog('buildPNode', `${it} done.`)))
  }, Promise.resolve()).then(plog('buildPNode', 'done.'))
}

module.exports = {
  buildPNode, // 构建pnode供处理扩展程序使用
}
