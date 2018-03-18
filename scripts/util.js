const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

function readTextFileSync (file) {
  return fs.readFileSync(file).toString()
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

function writeFileSync (file, data, opts) {
  return fs.writeFileSync(file, data, opts || {})
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

function copyFile (src, dest, flags) {
  return new Promise((resolve, reject) => {
    fs.copyFile(src, dest, flags || 0, (err) => {
      if (err) {
        return reject(err)
      }
      resolve(dest)
    })
  })
}

function removeFile (src) {
  return new Promise((resolve, reject) => {
    fs.unlink(src, (err) => {
      if (err) {
        return reject(err)
      }
      resolve(src)
    })
  })
}

function moveFile (src, dest) {
  return new Promise((resolve, reject) => {
    fs.rename(src, dest, (err) => {
      if (err) {
        return reject(err)
      }
      resolve(dest)
    })
  })
}

function exist (src, mode) {
  return new Promise((resolve, reject) => {
    fs.access(src, mode || fs.constants.F_OK, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return resolve(false)
        }
        return reject(err)
      }
      resolve(src)
    })
  })
}

function existSync (src, mode) {
  try {
    fs.accessSync(src, mode || fs.constants.F_OK)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    }
    throw err
  }
}

function spawn (bin, args, opts) {
  return new Promise((resolve, reject) => {
    try {
      let distOpts = Object.assign({ stdio: 'inherit' }, opts)
      let ps = childProcess.spawn(bin, args, distOpts)
      let obuf = []
      let ebuf = []
      if (!distOpts.stdio) {
        ps.stdout.on('data', (buf) => {
          obuf = obuf.concat(buf)
        })
        ps.stderr.on('data', (buf) => {
          ebuf = ebuf.concat(buf)
        })
      }
      ps.on('close', (code) => {
        if (code) {
          return reject(code)
        }
        resolve({stdout: obuf.join(), stderr: ebuf.join()})
      })
    } catch (err) {
      reject(err)
    }
  })
}

let nodeVersion = process.env.PKG_NODE_VERSION || 8

let targets = {
  win: {
    target: `node${nodeVersion}-win-x64`
  },
  mac: {
    target: `node${nodeVersion}-macos-x64`
  },
  linux: {
    target: `node${nodeVersion}-linux-x64`
  }
}

let platform
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

let defaultTarget = targets[platform]

if (process.env.PKG_ONLY) {
  let pkg = process.env.PKG_ONLY
  for (let name in targets) {
    if (name !== pkg) {
      delete targets[name]
    }
  }
}

function getCacheList () {
  let infoFile = path.join(__dirname, '../cache/info.json')
  if (existSync(infoFile)) {
    return readTextFileSync(infoFile)
  }
  return "[]"
}

function addToCacheList (info) {
  let text = JSON.stringify(info)
  let data = getCacheList()
  let pos = data.indexOf(text)
  if (pos === -1) {
    let infoFile = path.join(__dirname, '../cache/info.json')
    data = JSON.parse(data)
    data.push(info)
    writeFileSync(infoFile, JSON.stringify(data))
  }
}

function plog (func, text) {
  return () => {
    let str = `* ${func}`
    while (str.length < 30) {
      str += ' '
    }
    console.log(str, '>', text)
  }
}

function readDir (dir, opts) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, opts, (err, dirs) => {
      if (err) {
        return reject(err)
      }
      if (opts.exclude) {
        let exclude = opts.exclude
        if (!Array.isArray(opts.exclude)) {
          exclude = exclude.split('|')
        }
        dirs = dirs.filter(it => !exclude.some(t => it.indexOf(t) !== -1))
      }
      let ret
      if (opts.join || opts.fullPath) {
        ret = dirs.map(it => opts.fullPath ? path.resolve(dir, it) : path.join(dir, it))
        if (opts.map) {
          resolve(ret.reduce((dist, path, id) => {
            dist[dirs[id]] = path
            return dist
          }, {}))
        }
      }
      resolve(dirs)
    })
  })
}

module.exports = {
  readTextFile,
  readTextFileSync,
  writeFile,
  writeFileSync,
  copyFile,
  moveFile,
  removeFile,
  exist,
  existSync,
  spawn,
  nodeVersion,
  targets,
  platform,
  getCacheList,
  addToCacheList,
  plog,
  readDir,
  defaultTarget
}
