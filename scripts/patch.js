const fs = require('fs')
const bootstrap = require.resolve('pkg/prelude/bootstrap.js')
const apps = require('../apps.js')

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

    // runMain
    find = `Module.runMain = function () {
    Module._load(ENTRYPOINT, null, true);
    process._tickCallback();
  };`
    pos = data.indexOf(find)
    if (pos === -1) {
      console.error('can not match patch')
      process.exit(2)
    }
    data = data.substr(0, pos) + repace + data.substr(pos + find.length, data.length)

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

const repace = `
  var once = false
  Module.runMain = function () {
    if (once) {
      let main = process.argv[1]
      let arr = ['ava']
      let map = ['ava/cli']
      if (main) {
        for (let i=0; i< arr.length; ++i) {
          if (main.indexOf(arr[i]) === main.length - arr[i].length) {
            Module._load(process.env.ENTRYMODULE + '/' + map[i], null, true);
            process._tickCallback();
            return
          }
        }
      }
      Module._load(process.argv[1], null, true);
      process._tickCallback();
      return
    }
    once = true
    Module._load(ENTRYPOINT, null, true);
    process._tickCallback();
  };
`

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

function writeFile (file, data, opts) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, opts || {}, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

writeFile('./apps-resolve.js', Object.keys(apps).reduce((ret, it) => {
  let app = apps[it]
  ret.push(`require.resolve("${app.bin}")`)
  if (Array.isArray(app.api)) {
    app.api.forEach(name => ret.push(`require.resolve("${name}")`))
  } else if (app.api) {
    ret.push(`require.resolve("${app.api}")`)
  }
  return ret
}, []).join('\n'))
