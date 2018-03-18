const {spawn, defaultTarget, plog} = require('./util.js')
const path = require('path')

function buildPNode () {
  const pkg = path.resolve(`./node_modules/.bin/pkg${process.platform === 'win32' ? '.cmd' : ''}`)
  // 使用这个版本的node处理对应的nodejs扩展
  return spawn(pkg, [
    '-t', defaultTarget.target,
    '--config', 'pnode.json', 'main.js'], {
      cwd: path.join(__dirname, 'pnode')
    }).then(plog('buildPNode', 'done.'))
}

module.exports = {
  buildPNode, // 构建pnode供处理扩展程序使用
}
