var Module = require('module')
let entrypoint = process.argv[2]
if (entrypoint) {
  if (entrypoint === '-m') {
    console.log(process.versions.modules)
    process.exit(0)
  } else if (entrypoint === '-v') {
    console.log(process.versions.node)
    process.exit(0)
  }
  Module._load(entrypoint, null, true)
  process._tickCallback() 
}
