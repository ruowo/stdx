const fs = require('fs')
const path = require('path')
let {targets, plog, exist, copyFile, removeFile, getCacheList, readTextFile, writeFile, nodeVersion} = require('./util.js')
const childProcess = require('child_process')
let packageFile = require('../package.json')
const packageJSON = strip(JSON.parse(JSON.stringify(packageFile)))
const commands = require('../apps.js')
const entries = Object.keys(commands)
const apps = ['stdx'].concat(entries.filter(it => commands[it].bin))

function strip (pkg) {
  ['scripts', 'devDependencies', 'dependencies', 'bin'].forEach(it => delete pkg[it])
  return JSON.stringify(pkg)
}

const pkg = path.resolve(`./node_modules/.bin/pkg${process.platform === 'win32' ? '.cmd' : ''}`)
const bin = apps.reduce((ret, it) => {
  ret[it] = `bin/${it}`
  return ret
}, {})

function pack (platform, opts) {
  let dist = path.resolve('./platform/' + platform)
  return new Promise((resolve, reject) => {
    let ps = childProcess.spawn(pkg, [
      '-t', opts.target,
      '--out-path', dist,
      '--config', 'pkg.json', 'main.js'], { stdio: 'inherit' })
    ps.on('close', (code) => {
      if (code) {
        return reject(new Error(`${platform} error: ${code}`))
      }
      resolve()
    })
  }).then(() => createPlatformPackageJson(platform))
}

function createPlatformPackageJson (platform) {
  let dist = path.resolve('./platform/' + platform)
  var pkgfile = JSON.parse(packageJSON)
  pkgfile.name = pkgfile.name + '-' + platform
  pkgfile.bin = bin
  return writeFile(path.join(dist, 'package.json'), 
    JSON.stringify(pkgfile, null, 2))
}

function createBinCommands () {
  return readTextFile(path.join(__dirname, 'command-template')).then((buf) => {
    return Promise.all(apps.map(it => {
      let data = buf.replace('APP', it)
      if (it === 'stdx') {
        data = `#!/usr/bin/env node
require('../exec.js')(process.argv.slice(2))`
      }
      return Promise.all([
        writeFile(path.join(__dirname, `../bin/${it}`), data),
        writeFile(path.join(__dirname, `../platform/win/bin/${it}`), data),
        writeFile(path.join(__dirname, `../platform/mac/bin/${it}`), data),
        writeFile(path.join(__dirname, `../platform/linux/bin/${it}`), data)
      ])
    }))
  }).then(plog('createBinCommands', 'done.'))
}

function copyPlatformResources () {
  return Promise.all(Object.keys(targets).map(it => {
    let dist = path.join(__dirname, `../platform/${it}`)
    return Promise.all([
      copyFile(path.join(__dirname, `../README.md`),
        path.join(dist, `README.md`)),
      readTextFile(path.join(__dirname, `../exec.js`)).then(res => {
        let text = res.replace(/node-modules\/stdx-\w+\//g, '')
        return writeFile(path.join(dist, `exec.js`), text)
      }),
    ])
  })).then(plog('copyPlatformResources', 'done.'))
}

const platformMap = {
  win: 'win32',
  mac: 'darwin',
  linux: 'linux',
}

function buildPkg (platform, config) {
  return Promise.resolve().then(plog('buildPkg', `${platform}-node${nodeVersion} start`))
    .then(() => pack(platform, config))
    .then(plog('buildPkg', `${platform}-node${nodeVersion} done.`))
}

function buildPkgs () {
  // 已经串行下载过了, 这里可以并行了
  let cache = path.resolve('./cache')
  let dest = path.resolve('./platform')
  let pkgType = process.env.PKG_ONLY
  let target = Object.keys(targets).map(it => targets[it].target).join(',')
  if (pkgType) {
    target = targets[pkgType].target
  }
  return new Promise((resolve, reject) => {
    let args = [
      '-t', target,
      '--out-path', cache,
      '--config', 'pkg.json', 'main.js']
    let ps = childProcess.spawn(pkg, args , { stdio: 'inherit' })
    ps.on('close', (code) => {
      if (code) {
        return reject(new Error(`pkg error: ${code}`))
      }
      resolve()
    })
  }).then(() => {
    return Promise.all(Object.keys(targets)
      .filter(it => pkgType ? (it === pkgType) : true)
      .map((it) => {
        let cacheFile = targets[it].cacheFile
        if (pkgType) {
          cacheFile = cacheFile
            .replace('-macos', '')
            .replace('-linux', '')
            .replace('-win', '')
        }
        return Promise.all([
          createPlatformPackageJson(it),
          copyFile(path.join(cache, cacheFile),
            path.join(dest, it, targets[it].distFile))
        ]).then(plog('buildPkg', `${it} done.`))
      }))
  }).then(plog('buildPkgs', 'done.'))
  // return Promise.all(Object.keys(targets)
  //   .map((it) => buildPkg(it, targets[it])))
  //   .then(plog('buildPkgs', 'done.'))
  // return Object.keys(targets).reduce((ret, it) => {
  //   return ret.then(() => {
  //     return buildPkg(it, targets[it])
  //   })
  // }, Promise.resolve()).then(plog('buildPkgs', 'done.'))
}

function removeNodeAddins () {
  let arr = JSON.parse(getCacheList())
  return Promise.all(arr.map(it => {
    return exist(it.src).then(exists => exists && removeFile(it.src))
  }))
}

function resetNodeAddins () {
  let arr = JSON.parse(getCacheList())
  return Promise.all(arr.map(it => {
    return copyFile(it.dest, it.src)
  })).then(plog('resetNodeAddins', 'done.'))
}

function resetNodeAddin (info) {
  let keys = Object.keys(info)
  let arr = JSON.parse(getCacheList()).filter(it => {
    for (let i =0; i < keys.length; ++ i) {
      let key = keys[i]
      if (info[key] !== it[key]) {
        return false
      }
    }
    return true
  })
  return Promise.all(arr.map(it => {
    return copyFile(it.dest, it.src).then(plog('resetNodeAddin', it.src))
  }))
}

module.exports = {
  removeNodeAddins, // 删除所有nodejs C++扩展
  resetNodeAddins, // 还原所有扩展
  buildPkgs, // 构建所有包
  copyPlatformResources, // 把文件复制到platform
  createBinCommands, // 在bin目录创建所有命令, 同时会更新最外层的package.json
}
