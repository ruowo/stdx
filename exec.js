
module.exports = function (args) {
  require('child_process').spawn(require('path').resolve(__dirname, ({
    win32: 'platform/win/stdx.exe',
    darwin: 'platform/mac/stdx',
  })[process.platform] || 'platform/linux/stdx'), 
    args, { stdio: 'inherit' }
  ).on('close', function (code) {
    process.exit(code)
  })
}
