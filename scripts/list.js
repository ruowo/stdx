const {readDir} = require('./util.js')
const apps = Object.keys(require('../apps.js'))

readDir('./node_modules/.bin/', {
  exclude: '.cmd',
  fullPath: true,
  map: true
}).then(res => {
  apps.concat([// skips
    'pkg',
    'pkg-fetch',
    'ssass',
  ]).forEach(it => {
    if (res[it]) {
      delete res[it]
    }
  })
  console.log(res)
})
