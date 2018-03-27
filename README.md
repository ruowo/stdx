# stdx (Node开发工具箱)

> 还在为npm安装一堆的devDependencies而苦恼吗?

你需要这样一个工具:
- ES支持更好的node版本(目前稳定版8.10)
- 集成常用的工具库
- 集成常用的工具包
- 全局一次性安装

那来试试 stdx吧

## 安装

```
npm i -g stdx-win (window x64版本)
npm i -g stdx-mac (mac os x64 版本)
npm i -g stdx-linux (linx x64版本 --版本过多未测试)
npm i -g stdx (全量版本, 不推荐安装)
```

由于安装包比较大, 国内推荐用淘宝源或cnpm

```
npm install -g stdx --registry=https://registry.npm.taobao.org
```

## 项目样例

- [脚手架示例 https://github.com/std-tools/stdx-example](https://github.com/std-tools/stdx-example)

## 当作node使用

随便创建一个js脚本 `test.js`

```js
const _ = require('lodash')
const Json5 = require('json5')
const fse = require('fs-extra')
```

```
stdx ./test.js
```

当然你已经不需要再安装这些包了

# 集成环境

### 框架

- [express 4.16](https://npmjs.org/package/express)
  - [body-parser](https://npmjs.org/package/body-parser)
- [socket.io 2.0](https://npmjs.org/package/socket.io)
- vue [vue 2.5](https://npmjs.org/package/vue)
  - [vue-server-renderer](https://npmjs.org/package/vue-server-renderer)
  - [vue-template-compiler](https://npmjs.org/package/vue-template-compiler)

### 测试工具

- nyc [代码覆盖率检查](https://npmjs.org/package/nyc)
- ava [最快的测试框架](https://npmjs.org/package/ava)
- chai [最好用的断言库](https://npmjs.org/package/chai)
- browser-env [web模拟测试环境](https://npmjs.org/package/browser-env)

### 构建工具

- rollup [快速打包工具](https://npmjs.org/package/rollup)
  - [rollup-pluginutils](https://npmjs.org/package/rollup-pluginutils)
  - [rollup-plugin-node-resolve](https://npmjs.org/package/rollup-plugin-node-resolve)
  - [rollup-plugin-commonjs](https://npmjs.org/package/rollup-plugin-commonjs)
  - [rollup-plugin-json](https://npmjs.org/package/rollup-plugin-json)
  - [rollup-plugin-includepaths](https://npmjs.org/package/rollup-plugin-includepaths)
  - [rollup-plugin-babel](https://npmjs.org/package/rollup-plugin-babel)
  - [rollup-plugin-uglify](https://npmjs.org/package/rollup-plugin-uglify)
  - [rollup-plugin-vue](https://npmjs.org/package/rollup-plugin-vue)
  - [rollup-plugin-re](https://npmjs.org/package/rollup-plugin-re)
  - [rollup-plugin-serve](https://npmjs.org/package/rollup-plugin-serve)
  - [rollup-plugin-liveload](https://npmjs.org/package/rollup-plugin-liveload)
  - [rollup-plugin-node-globals 未测试](https://npmjs.org/package/rollup-plugin-node-globals)
  - [rollup-plugin-alias](https://npmjs.org/package/rollup-plugin-alias)
- uglifyjs [压缩必备](https://npmjs.org/package/uglifyjs)
- node-sass [sass样式预处理](https://npmjs.org/package/chai)
- less [less样式预处理](https://npmjs.org/package/less)
- stylus [stylus样式预处理](https://npmjs.org/package/stylus)
- babel [es预处理] (https://npmjs.org/package/babel)
  - [babel-cli](https://npmjs.org/package/babel-cli)
  - [babel-register](https://npmjs.org/package/babel-register)
  - [babel-runtime](https://npmjs.org/package/babel-runtime)
  - [babel-preset-env](https://npmjs.org/package/babel-preset-env)
  - [babel-preset-react](https://npmjs.org/package/babel-preset-react)
  - [babel-preset-stage-0](https://npmjs.org/package/babel-preset-stage-0)
  - [babel-preset-stage-1](https://npmjs.org/package/babel-preset-stage-1)
  - [babel-preset-stage-2](https://npmjs.org/package/babel-preset-stage-2)
  - [babel-preset-stage-3](https://npmjs.org/package/babel-preset-stage-3)

### 代码规范

- standard [代码标准化, 格式化](https://npmjs.org/package/standard)
  - eslint-plugin-vue [支持vue项目](https://npmjs.org/package/eslint-plugin-vue)
  - eslint-plugin-html [支持vue和html](https://npmjs.org/package/eslint-plugin-html)
- eslint [es代码规范](https://npmjs.org/package/eslint)
- standard-sass [sass样式代码标准化](https://npmjs.org/package/standard-sass)

### 附加类库

- lodash
- json5
- fs-extra
- is-*

### 附加工具

- ts [typescript](https://npmjs.org/package/typescript)
- which [命令查找](https://npmjs.org/package/which)
- uuid [UUID生成器](https://npmjs.org/package/uuid)
- watch-cli [目录监听](https://npmjs.org/package/watch-cli)
- cross-env [环境设置](https://npmjs.org/package/cross-env)
- npm-run-all [并行命令](https://npmjs.org/package/npm-run-all)
- hs [http-server](https://npmjs.org/package/http-server)

### 还需要什么呢?

- 欢迎star
- 欢迎issue
