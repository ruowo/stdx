const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
let packageFile = require('../package.json')
const packageJSON = strip(JSON.parse(JSON.stringify(packageFile)))
const apps = Object.keys(require('../apps.js'))

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
    console.log('--start:', platform)
    let ps = childProcess.spawn(pkg, [
      '-t', opts.target,
      '--out-path', dist,
      '--config', 'pkg.json', 'main.js'], { stdio: 'inherit' })
    ps.on('close', (code) => {
      if (code) {
        return reject(new Error(`${platform} error: ${code}`))
      }
      console.log('--done:', platform)
      resolve()
    })
  }).then(() => {
    var pkgfile = JSON.parse(packageJSON)
    pkgfile.name = pkgfile.name + '-' + platform
    pkgfile.bin = bin
    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(dist, 'package.json'), JSON.stringify(pkgfile, null, 2), (err) => {
        if (err) {
          return reject(new Error(`${platform} create package.json falt.`))
        }
        resolve()
      })
    })
  })
}

function readTextFile (file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data.toString())
    })
  })
}

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

function createBin () {
  return readTextFile(path.join(__dirname, 'command-template')).then((buf) => {
    packageFile.bin = bin
    return Promise.all(apps.map(it => {
      let data = buf.replace('APP', it)
      return Promise.all([
        writeFile(path.join(__dirname, `../bin/${it}`), data),
        writeFile(path.join(__dirname, `../platform/win/bin/${it}`), data),
        writeFile(path.join(__dirname, `../platform/mac/bin/${it}`), data),
        writeFile(path.join(__dirname, `../platform/linux/bin/${it}`), data)
      ])
    })).then(() => {
      return writeFile(path.join(__dirname, '../package.json'), JSON.stringify(packageFile, null, 2))
    })
  })
}

function copyExec () {
  return readTextFile(path.join(__dirname, `../exec.js`)).then(res => {
    let text = res.replace('platform/${' + 'platform}/', '')
    return Promise.all(Object.keys(targets).map(it => {
      return writeFile(path.join(__dirname, `../platform/${it}/exec.js`), text)
    }))
  })
}

function buildPkg () {
  if (process.platform === 'win32') {
    return Promise.all(Object.keys(targets).map(it => pack(it, targets[it])))
  }
  // travis 资源有限, 并行经常会失败...
  return Object.keys(targets).reduce((ret, it) => {
    return ret.then(() => {
      return pack(it, targets[it])
    })
  }, Promise.resolve())
}

const version = 8
const targets = {
  win: {
    target: `node${version}-win-x64`
  },
  mac: {
    target: `node${version}-macos-x64`
  },
  linux: {
    target: `node${version}-linux-x64`
  }
}

Promise.all([
  buildPkg(),
  copyExec(),
  createBin()
])
  .then(res => {
    console.log('build done.')
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
