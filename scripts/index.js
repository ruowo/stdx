const {
  buildPNode // 构建pnode供处理扩展程序使用
} = require('./build-pnode.js')

const {
  removeNodeAddins, // 删除所有nodejs C++扩展
  resetNodeAddins, // 还原所有扩展
  buildPkgs, // 构建所有包
  copyPlatformResources, // 把文件复制到platform
  createBinCommands // 在bin目录创建所有命令, 同时会更新最外层的package.json
} = require('./build.js')

const {
  createAppResolve, // 创建 apps-resolve.js
  patchPkg, // 给pkg打布丁
  patchCodegen, // 修正JSON5升级ava失败问题
  patchNodeSass // 需要使node-sass可以下载不同平台的包
} = require('./patch.js')

const {
  // copyUws, // // 复制uws插件包
  downloadNodeSassAddions // 下载node-sass各个平台的插件包
} = require('./fetch.js')

function prepare () {
  return Promise.all([
    // resetNodeAddins(),
    createAppResolve(),
    patchPkg(), 
    patchCodegen(),
    createBinCommands(),
    copyPlatformResources(),
    Promise.all([
      buildPNode(),
      patchNodeSass(),
    ]).then(() => Promise.all([
      // copyUws(), // socket.io有变, 不再需要这个了
      downloadNodeSassAddions()
    ]))
  ])
}

/*
PKG_CACHE_PATH 缓存目录 ~/.pkg-cache (ci里面使用)
PKG_NODE_VERSION node版本 8
PKG_ONLY 只构建某个版本 win mac linux
 */
prepare()
.then(buildPkgs)
.catch(err => {
  console.error('xxxxxxxxxxx安装node8.x试试看吧xxxxxxxxxxxxxxxxx')
  console.error(err)
  console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  process.exit(1)
})
