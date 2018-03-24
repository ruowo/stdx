
module.exports = function (args) {
  require('child_process').spawn(require('path').resolve(__dirname, ({
    win32: 'node-modules/stdx-win/stdx.exe',
    darwin: 'node-modules/stdx-mac/stdx',
  })[process.platform] || 'node-modules/stdx-linux/stdx'), 
    args, { stdio: 'inherit' }
  ).on('close', function (code) {
    process.exit(code)
  })
}
