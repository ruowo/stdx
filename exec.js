var path = require('path')
var childProcess = require('child_process')
let platform = process.platform
switch (process.platform) {
  case 'win32':
    platform = 'win'
    break
  case 'darwin':
    platform = 'mac'
    break
  default:
    platform = 'linux'
    break
}
const cmd = path.resolve(`./platform/${platform}/stdx${process.platform === 'win32' ? '.exe' : ''}`)

module.exports = function (args) {
  let ps = childProcess.spawn(cmd, args, { stdio: 'inherit' })
  ps.on('close', (code) => {
    process.exit(code)
  })
}
