var path = require('path')
var childProcess = require('child_process')
var platform = process.platform
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
var cmd = path.resolve(__dirname, `./platform/${platform}/stdx${process.platform === 'win32' ? '.exe' : ''}`)

module.exports = function (args) {
  var ps = childProcess.spawn(cmd, args, { stdio: 'inherit' })
  ps.on('close', (code) => {
    process.exit(code)
  })
}
