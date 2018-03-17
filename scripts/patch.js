const fs = require('fs')
const bootstrap = require.resolve('pkg/prelude/bootstrap.js')

fs.readFile(bootstrap, (err, data) => {
  if (err) {
    console.error('can not read bootstrap.js')
    process.exit(1)
  }
  data = data.toString()
  if (data.indexOf('ENTRYMODULE') === -1) {
    let find = 'Module.runMain;'
    let pos = data.indexOf(find)
    if (pos === -1) {
      console.error('can not match patch')
      process.exit(2)
    }
    data = data.substr(0, pos + find.length) + inject + data.substr(pos + find.length, data.length)
    
    find = 'error.message +='
    pos = data.indexOf(find)
    let find2 = `'process.execPath.';`
    let pos2 = data.indexOf(find2)
    if ((pos === -1) || (pos2 === -1)) {
      console.error('can not match patch')
      process.exit(2)
    }
    data = data.substr(0, pos) + data.substr(pos2 + find2.length, data.length)
    // console.log(data.substr(pos, inject.length + 20 + find.length))
    fs.writeFile(bootstrap, data, (err) => {
      if (err) {
        console.error('can not write bootstrap.js')
        process.exit(3)
      }
      console.log('patched.')
    })
  } else {
    console.log('already patched.')
  }
})

const inject = `
  ancestor._nodeModulePaths = Module._nodeModulePaths
  Module._nodeModulePaths = function () {
    var paths = ancestor._nodeModulePaths.apply(this, arguments)
    if (process.env.ENTRYMODULE) {
      var ret = paths.concat(process.env.ENTRYMODULE)
      return ret
    }
    return paths
  }
`
