const fs = require('fs')
const path = require('path')
const {readTextFile, writeFile, plog} = require('./util.js')

function patchPkg () {
  const bootstrap = require.resolve('pkg/prelude/bootstrap.js')
  return readTextFile(bootstrap).then(data => {
    if (data.indexOf('ENTRYMODULE') === -1) {
      // 注入 _nodeModulePaths
      let find = 'Module.runMain;'
      let pos = data.indexOf(find)
      if (pos === -1) {
        throw new Error('can not match patch _nodeModulePaths')
      }
      data = data.substr(0, pos + find.length) + inject + data.substr(pos + find.length, data.length)    
      // 去掉警告
      find = 'error.message +='
      pos = data.indexOf(find)
      let find2 = `'process.execPath.';`
      let pos2 = data.indexOf(find2)
      if ((pos === -1) || (pos2 === -1)) {
        throw new Error('can not match patch message')
      }
      data = data.substr(0, pos) + data.substr(pos2 + find2.length, data.length)
      // 修改 runMain
      find = `Module.runMain = function () {
    Module._load(ENTRYPOINT, null, true);
    process._tickCallback();
  };`
      pos = data.indexOf(find)
      if (pos === -1) {
        throw new Error('can not match patch runMain')
      }
      data = data.substr(0, pos) + repace + data.substr(pos + find.length, data.length)

      // 写入文件
      return writeFile(bootstrap, data).then(plog('patchPkg', 'done'))
    }
    plog('patchPkg', 'skip')()
  })
}

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
  ancestor._nodeModulePaths = Module._nodeModulePaths;
  var cwd = null;
  var cwdPaths = [];
  var sep = require('path').sep;

  function getCwdPaths() {
    let curr = process.cwd();
    if (curr !== cwd) {
      var root = '';
      curr.split(sep).forEach(function (curr, index) {
        if (curr) {
          if (curr === 'node_modules') { // skip in node_modules
            return;
          }
          root += curr + sep;
          cwdPaths.unshift(root + 'node_modules');
        } else if (index ===0 ) {// /usr/bin
          root = sep; // skip /node_modules
        }
      })
      cwd = curr;
    }
    return cwdPaths;
  }
  getCwdPaths();

  Module._nodeModulePaths = function () {
    var paths = cwdPaths.concat(ancestor._nodeModulePaths.apply(this, arguments));
    if (process.env.ENTRYMODULE) {
      var ret = paths.concat(process.env.ENTRYMODULE);
      return ret;
    }
    return paths;
  }
`

function createAppResolve() {
  const apps = require('../apps.js')
  return writeFile('./apps-resolve.js', Object.keys(apps).reduce((ret, it) => {
    let app = apps[it]
    ret.push(`require.resolve("${app.bin}")`)
    if (Array.isArray(app.api)) {
      app.api.forEach(name => ret.push(`require.resolve("${name}")`))
    } else if (app.api) {
      ret.push(`require.resolve("${app.api}")`)
    }
    return ret
  }, []).join('\n')).then(plog('createAppResolve', 'done.'))
}

function patchNodeSass () {
  let file = require.resolve('node-sass/lib/extensions')
  return readTextFile(file).then(text => {
    let find = 'platform = process.platform;'
    let append = 'if (process.env.SASS_CUSTOM_PLATFORM) {platform = process.env.SASS_CUSTOM_PLATFORM}'
    if (text.indexOf('SASS_CUSTOM_PLATFORM') !== -1) {
      return plog('patchNodeSass', 'skip.')()
    }
    let pos = text.indexOf(find)
    if (pos === -1) {
      throw new Error('can not patch node-sass install')
    }
    text = text.substr(0, pos + find.length) + append + text.substr(pos + find.length, text.length)
    return writeFile(file, text).then(plog('patchNodeSass', 'done.'))
  })
}

module.exports = {
  createAppResolve, // 创建 apps-resolve.js
  patchPkg, // 给pkg打布丁
  patchNodeSass, // 需要使node-sass可以下载不同平台的包
}
